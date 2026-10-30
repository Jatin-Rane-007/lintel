import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const previewAuth = true; // TEMP-LOOK: reach the auth screens while signed in.

  if (!isLoaded) return null;

  if (isSignedIn && !previewAuth) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
