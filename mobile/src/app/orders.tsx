import Feather from "@expo/vector-icons/Feather";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, View } from "react-native";
import { ScreenHeader } from "@/components/screen-header";
import { Body, Label, Mono } from "@/components/text";
import { useApi } from "@/hooks/use-api";
import { openOnWebsite } from "@/lib/checkout";
import { formatNaira } from "@/lib/format";
import type { Order } from "@/lib/types";
import { useToast } from "@/state/toast";
import { useTheme } from "@/theme/theme";

const dateFormat = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" });

// Orders placed with this account on the website or from the app. Each opens on the website,
// where payment can be retried and the receipt lives.
export default function Orders() {
  const { colors } = useTheme();
  const toast = useToast();
  const { data, error, loading, reload } = useApi<{ orders: Order[] }>("/api/orders");

  const open = (order: Order) =>
    openOnWebsite(order.path).catch(() => toast.show({ message: "Couldn't open that order. Try again." }));

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={loading && !!data} onRefresh={reload} tintColor={colors.ink} />}
    >
      <ScreenHeader title="Orders" />
      {!data ? (
        error ? (
          <Body color={colors.muted} style={{ padding: 16 }}>
            {error}
          </Body>
        ) : (
          <ActivityIndicator color={colors.ink} style={{ marginTop: 32 }} />
        )
      ) : data.orders.length === 0 ? (
        <Body color={colors.muted} style={{ padding: 16 }}>
          No orders yet. When you check out, on the website or from the app, your orders show up here.
        </Body>
      ) : (
        data.orders.map((order) => (
          <Pressable
            key={order.id}
            onPress={() => open(order)}
            accessibilityRole="link"
            style={({ pressed }) => ({ padding: 16, borderBottomWidth: 1.5, borderColor: colors.line, opacity: pressed ? 0.6 : 1 })}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Mono size={14} style={{ flex: 1 }}>
                {order.reference}
              </Mono>
              <Mono size={14}>{formatNaira(order.total)}</Mono>
              <Feather name="chevron-right" size={18} color={colors.ink} />
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
              <Label size={10} color={order.status === "pending_payment" ? colors.accent : colors.ink}>
                {order.statusLabel}
              </Label>
              <Label size={10} color={colors.muted}>
                · {dateFormat.format(new Date(order.createdAt))} · {order.method}
              </Label>
            </View>
            <Body size={14} color={colors.muted} style={{ marginTop: 6 }} numberOfLines={2}>
              {order.items.map((item) => `${item.quantity} × ${item.name}${item.finish ? ` (${item.finish})` : ""}`).join(", ")}
            </Body>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}
