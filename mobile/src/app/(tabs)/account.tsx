import Feather from "@expo/vector-icons/Feather";
import * as WebBrowser from "expo-web-browser";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "@/components/icon-button";
import { Logo } from "@/components/logo";
import { MenuRow } from "@/components/menu-row";
import { Body, Display, Label } from "@/components/text";
import { useApi } from "@/hooks/use-api";
import { API_URL } from "@/lib/config";
import { initials, timeAgo } from "@/lib/format";
import type { Me } from "@/lib/types";
import { useSession } from "@/state/session";
import { useSettings } from "@/state/settings";
import { useTheme } from "@/theme/theme";

const PROVIDERS: Record<string, string> = { google: "Google" };

export default function Account() {
  const { colors, scheme, toggle } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useSession();
  const { alerts, setAlerts } = useSettings();
  const { data: me, reload } = useApi<Me>("/api/me");

  // Refresh "signed in on" and the counts whenever the tab is opened.
  useFocusEffect(useCallback(() => reload(), [reload]));

  const profile = me?.user ?? user;
  const provider = me?.provider ? (PROVIDERS[me.provider] ?? me.provider) : "Google";
  const sessions = me ? [...me.sessions].sort((a, b) => Number(b.current) - Number(a.current)).slice(0, 5) : [];

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 32 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Logo size={28} />
        <IconButton label={scheme === "dark" ? "Use light theme" : "Use dark theme"} onPress={toggle}>
          <Feather name={scheme === "dark" ? "moon" : "sun"} size={21} color={colors.ink} />
        </IconButton>
      </View>
      <Display size={46} style={{ marginTop: 18 }}>
        Account
      </Display>

      <View
        style={{
          marginTop: 18,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          padding: 16,
          borderWidth: 1.5,
          borderColor: colors.ink,
          borderRadius: 10,
          backgroundColor: colors.surface,
        }}
      >
        <View style={{ width: 54, height: 54, borderRadius: 27, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center" }}>
          <Display size={22} color={colors.paper} style={{ lineHeight: 24 }}>
            {initials(profile?.name, profile?.email)}
          </Display>
        </View>
        <View style={{ flex: 1 }}>
          <Body size={16} weight="semibold" numberOfLines={1}>
            {profile?.name ?? "Your account"}
          </Body>
          <Body size={14} color={colors.muted} numberOfLines={1}>
            {profile?.email}
          </Body>
          <Label size={10} style={{ marginTop: 2 }}>
            Signed in with {provider}
          </Label>
        </View>
      </View>

      <Label size={11} style={{ marginTop: 22 }}>
        Signed in on
      </Label>
      <View style={{ marginTop: 8, borderTopWidth: 1.5, borderBottomWidth: 1.5, borderColor: colors.ink }}>
        {sessions.map((session, index) => (
          <View
            key={session.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              minHeight: 54,
              borderTopWidth: index ? 1.5 : 0,
              borderColor: colors.line,
            }}
          >
            <Feather name={session.client === "app" ? "smartphone" : "monitor"} size={19} color={colors.ink} />
            <Body style={{ flex: 1 }} numberOfLines={1}>
              {session.current ? "This phone" : session.device}
            </Body>
            <Label size={10}>{session.current ? "Now" : timeAgo(session.lastSeenAt)}</Label>
          </View>
        ))}
        {!me ? <View style={{ height: 54 }} /> : null}
      </View>

      <View style={{ marginTop: 24, borderTopWidth: 1.5, borderBottomWidth: 1.5, borderTopColor: colors.ink, borderBottomColor: colors.line }}>
        <MenuRow label="Orders" value={me ? String(me.counts.orders) : undefined} onPress={() => router.push("/orders")} />
        <MenuRow label="Saved addresses" onPress={() => router.push("/addresses")} />
        <MenuRow label="Notifications" value={alerts ? "On" : "Off"} onPress={() => setAlerts(!alerts)} />
        <MenuRow label="Help and returns" onPress={() => void WebBrowser.openBrowserAsync(`${API_URL}/terms`)} />
        <MenuRow label="Delete account" onPress={() => router.push("/delete-account")} last />
      </View>

      <Pressable onPress={signOut} accessibilityRole="button" style={{ marginTop: 28, alignSelf: "flex-start" }} hitSlop={10}>
        <Body color={colors.accent}>Sign out</Body>
      </Pressable>
    </ScrollView>
  );
}
