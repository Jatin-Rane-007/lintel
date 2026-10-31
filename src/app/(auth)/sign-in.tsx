import { useSignIn } from '@clerk/expo';
import { type Href, useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

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

/**
 * Sign in (§6.2). Two steps at most: the form, then the emailed code when
 * Clerk asks this device to prove itself. The action is pinned above the
 * keyboard so it is never scrolled away.
 */
export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [awaitingCode, setAwaitingCode] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const isLoading = fetchStatus === 'fetching';

  const finish = async () => {
    await signIn.finalize({
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

    const { error } = await signIn.password({
      emailAddress: email.trim(),
      password,
    });

    if (error) return;

    if (signIn.status === 'complete') {
      await finish();
      return;
    }

    if (signIn.status === 'needs_client_trust') {
      await signIn.mfa.sendEmailCode();
      setAwaitingCode(true);
      return;
    }

    if (signIn.status === 'needs_second_factor') {
      const canUseEmail = signIn.supportedSecondFactors.some(
        (factor) => factor.strategy === 'email_code',
      );

      if (canUseEmail) {
        await signIn.mfa.sendEmailCode();
        setAwaitingCode(true);
        return;
      }

      setNotice(
        'This account needs a phone code, which this version of the app cannot send yet. Sign in on the web to finish.',
      );
      return;
    }

    setNotice('That email and password did not finish signing in. Check both and try again.');
  };

  const verify = async () => {
    setNotice(null);
    await signIn.mfa.verifyEmailCode({ code: code.trim() });

    if (signIn.status === 'complete') {
      await finish();
      return;
    }

    setNotice('That code did not work. Check it, or send a new one.');
  };

  const startOver = async () => {
    await signIn.reset();
    setAwaitingCode(false);
    setCode('');
    setNotice(null);
  };

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
                onPress={() => signIn.mfa.sendEmailCode()}
                disabled={isLoading}
              />
              <TextLink label="Use another account" onPress={startOver} disabled={isLoading} />
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
      title="Welcome back"
      description="Sign in to keep your shortlist, and to see new homes as they are added."
      footer={
        <>
          <Button label="Sign in" large loading={isLoading} onPress={submit} />
          <AuthSwitch
            prompt="New to lintel?"
            actionLabel="Create an account"
            onPress={() => router.replace('/sign-up')}
          />
        </>
      }
    >
      {notice ? <AuthMessage tone="error">{notice}</AuthMessage> : null}

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
        error={errors.fields.identifier?.message}
      />

      <TextField
        label="Password"
        placeholder="Your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        autoComplete="current-password"
        textContentType="password"
        onSubmitEditing={submit}
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
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  reveal: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
