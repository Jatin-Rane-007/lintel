import { useAuth, useSignUp } from '@clerk/expo';
import { type Href, useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AuthLinkRow,
  AuthMessage,
  AuthScaffold,
  AuthSwitch,
  TextLink,
} from '@/components/auth/auth-scaffold';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { TextField } from '@/components/ui/text-field';
import { spacing } from '@/theme/tokens';

/**
 * Create an account (§6.2). Same two-step sheet as sign in: the details, then
 * the code Clerk emails to prove the address. The captcha mount point stays in
 * the tree for the whole step-one form, so Clerk can attach its widget.
 */
export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [awaitingCode, setAwaitingCode] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const isLoading = fetchStatus === 'fetching';

  const finish = async () => {
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          setNotice('This account still has a step to finish in the browser.');
          return;
        }
        router.replace(decorateUrl('/') as Href);
      },
    });
  };

  const submit = async () => {
    setNotice(null);

    const { error } = await signUp.password({
      emailAddress: email.trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });

    if (error) {
      setNotice('We could not create that account. Check the details and try again.');
      return;
    }

    if (signUp.status === 'complete') {
      await finish();
      return;
    }

    await signUp.verifications.sendEmailCode();
    setAwaitingCode(true);
  };

  const verify = async () => {
    setNotice(null);
    await signUp.verifications.verifyEmailCode({ code: code.trim() });

    if (signUp.status === 'complete') {
      await finish();
      return;
    }

    setNotice('That code did not work. Check it, or send a new one.');
  };

  const startOver = async () => {
    await signUp.reset();
    setAwaitingCode(false);
    setCode('');
    setNotice(null);
  };

  if (isSignedIn) return null;

  if (awaitingCode) {
    return (
      <AuthScaffold
        step={2}
        title="Check your email"
        description={`We sent a code to ${email.trim() || 'your address'}. It expires in a few minutes.`}
        footer={
          <>
            <Button label="Verify and continue" large loading={isLoading} onPress={verify} />
            <AuthLinkRow>
              <TextLink
                label="Send a new code"
                onPress={() => signUp.verifications.sendEmailCode()}
                disabled={isLoading}
              />
              <TextLink label="Start over" onPress={startOver} disabled={isLoading} />
            </AuthLinkRow>
          </>
        }
      >
        {notice ? <AuthMessage tone="error">{notice}</AuthMessage> : null}
        <TextField
          label="Code"
          placeholder="Six digits"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          autoComplete="one-time-code"
          error={errors.fields.code?.message}
        />
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold
      step={1}
      title="Create your account"
      description="Keep a shortlist of homes and pick up where you left off on any phone."
      footer={
        <>
          <Button label="Create account" large loading={isLoading} onPress={submit} />
          <AuthSwitch
            prompt="Already have an account?"
            actionLabel="Sign in"
            onPress={() => router.replace('/sign-in')}
          />
        </>
      }
    >
      {notice ? <AuthMessage tone="error">{notice}</AuthMessage> : null}

      <View style={styles.pair}>
        <View style={styles.pairCell}>
          <TextField
            label="First name"
            placeholder="Asha"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            autoComplete="given-name"
            textContentType="givenName"
            error={errors.fields.firstName?.message}
          />
        </View>
        <View style={styles.pairCell}>
          <TextField
            label="Last name"
            placeholder="Menon"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            autoComplete="family-name"
            textContentType="familyName"
            error={errors.fields.lastName?.message}
          />
        </View>
      </View>

      <TextField
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        error={errors.fields.emailAddress?.message}
      />

      <TextField
        label="Password"
        placeholder="At least 8 characters"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        autoComplete="new-password"
        textContentType="newPassword"
        onSubmitEditing={submit}
        hint="Eight characters or more. A phrase you remember beats a scramble."
        error={errors.fields.password?.message}
        accessory={
          <PressableScale
            onPress={() => setShowPassword((value) => !value)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            style={styles.reveal}
          >
            <Icon glyph={showPassword ? EyeOff : Eye} size="sm" tone="textMuted" />
          </PressableScale>
        }
      />

      {/* Clerk's bot-protection mount point — must stay mounted on this step. */}
      <View nativeID="clerk-captcha" />
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  pair: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  pairCell: {
    flex: 1,
  },
  reveal: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
