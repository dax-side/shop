import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/button";
import { ScreenHeader } from "@/components/screen-header";
import { Body } from "@/components/text";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/state/session";
import { useTheme } from "@/theme/theme";

// Deleting the account removes it everywhere: the website, this app and any other phone.
export default function DeleteAccount() {
  const { colors } = useTheme();
  const { user, signOut } = useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    setBusy(true);
    setError(null);
    try {
      await api("/api/me", { method: "DELETE", body: { confirm: "delete my account" } });
      await signOut();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Couldn't delete the account. Try again.");
      setBusy(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
      <ScreenHeader title="Delete account" />
      <View style={{ padding: 16, gap: 14 }}>
        <Body>
          This deletes the account for {user?.email ?? "this email"} and signs you out on the website and on every phone.
        </Body>
        <Body color={colors.muted}>
          Your bag and saved items are removed. Orders you have placed are kept by the shop for its records, but no longer
          linked to an account. Signing in with Google again later creates a new, empty account.
        </Body>
        {error ? (
          <Body accessibilityRole="alert" color={colors.accent}>
            {error}
          </Body>
        ) : null}
        <Button onPress={remove} loading={busy} style={{ backgroundColor: colors.accent, borderColor: colors.accent, marginTop: 8 }}>
          Delete my account
        </Button>
      </View>
    </ScrollView>
  );
}
