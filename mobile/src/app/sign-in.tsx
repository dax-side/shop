import AntDesign from "@expo/vector-icons/AntDesign";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { Body, Serif } from "@/components/text";
import { ApiError } from "@/lib/api";
import { API_URL } from "@/lib/config";
import { useSession } from "@/state/session";
import { useTheme } from "@/theme/theme";

export default function SignIn() {
  const { signIn } = useSession();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onContinue() {
    setBusy(true);
    setError(null);
    try {
      await signIn();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Couldn't sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const open = (path: string) => void WebBrowser.openBrowserAsync(`${API_URL}${path}`);

  return (
    <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Logo size={120} />
        <Serif italic={false} size={30} style={{ marginTop: 28, maxWidth: 250 }}>
          One account for the shop, the website and this app.
        </Serif>
        <Body color={colors.muted} style={{ marginTop: 20 }}>
          Sign in with the account you use on the website. Your bag and orders follow you.
        </Body>
      </View>

      {error ? (
        <Body accessibilityRole="alert" color={colors.accent} style={{ marginBottom: 12 }}>
          {error}
        </Body>
      ) : null}
      <Button onPress={onContinue} loading={busy} icon={<AntDesign name="google" size={18} color={colors.paper} />}>
        Continue with Google
      </Button>
      <Body size={12} color={colors.muted} style={{ textAlign: "center", marginTop: 20 }}>
        By continuing you agree to our{" "}
        <Text style={{ color: colors.ink, textDecorationLine: "underline" }} onPress={() => open("/terms")}>
          terms
        </Text>{" "}
        and{" "}
        <Text style={{ color: colors.ink, textDecorationLine: "underline" }} onPress={() => open("/privacy")}>
          privacy policy
        </Text>
        .
      </Body>
    </View>
  );
}
