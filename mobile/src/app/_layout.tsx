import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CartProvider } from "@/state/cart";
import { SessionProvider, useSession } from "@/state/session";
import { SettingsProvider } from "@/state/settings";
import { ToastProvider } from "@/state/toast";
import { fontFiles } from "@/theme/fonts";
import { ThemeProvider, useTheme } from "@/theme/theme";

void SplashScreen.preventAutoHideAsync();
// On the web build, the sign-in popup lands here and hands the result back to the opener.
if (Platform.OS === "web") WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontFiles);
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SettingsProvider>
          <SessionProvider>
            <ToastProvider>
              <CartProvider>
                <RootNavigator ready={fontsLoaded || !!fontError} />
              </CartProvider>
            </ToastProvider>
          </SessionProvider>
        </SettingsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator({ ready }: { ready: boolean }) {
  const { status } = useSession();
  const { colors, scheme } = useTheme();
  const loading = !ready || status === "loading";

  useEffect(() => {
    if (!loading) SplashScreen.hide();
  }, [loading]);

  if (loading) return null;

  return (
    <>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }}>
        <Stack.Protected guard={status === "signedIn"}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Protected guard={status === "signedOut"}>
          <Stack.Screen name="sign-in" />
        </Stack.Protected>
        <Stack.Screen name="auth" />
      </Stack>
    </>
  );
}
