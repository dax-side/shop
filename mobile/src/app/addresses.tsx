import { ActivityIndicator, ScrollView, View } from "react-native";
import { ScreenHeader } from "@/components/screen-header";
import { Body, Label } from "@/components/text";
import { useApi } from "@/hooks/use-api";
import type { Address } from "@/lib/types";
import { useTheme } from "@/theme/theme";

// Delivery addresses from past orders; checkout on the website offers them again.
export default function Addresses() {
  const { colors } = useTheme();
  const { data, error } = useApi<{ addresses: Address[] }>("/api/me/addresses");

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
      <ScreenHeader title="Saved addresses" />
      {!data ? (
        error ? (
          <Body color={colors.muted} style={{ padding: 16 }}>
            {error}
          </Body>
        ) : (
          <ActivityIndicator color={colors.ink} style={{ marginTop: 32 }} />
        )
      ) : data.addresses.length === 0 ? (
        <Body color={colors.muted} style={{ padding: 16 }}>
          No addresses yet. The delivery addresses you use at checkout are kept here.
        </Body>
      ) : (
        data.addresses.map((address, index) => (
          <View key={index} style={{ padding: 16, borderBottomWidth: 1.5, borderColor: colors.line, gap: 2 }}>
            <Label size={10} color={colors.muted}>
              {index === 0 ? "Last used" : "Used before"}
            </Label>
            <Body weight="semibold" style={{ marginTop: 4 }}>
              {address.firstName} {address.lastName}
            </Body>
            <Body>{address.street}</Body>
            {address.landmark ? <Body color={colors.muted}>Near {address.landmark}</Body> : null}
            <Body>{[address.area, address.state].filter(Boolean).join(", ")}</Body>
            <Body color={colors.muted}>{address.phone}</Body>
          </View>
        ))
      )}
    </ScrollView>
  );
}
