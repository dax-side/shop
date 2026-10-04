import { View } from "react-native";
import { Display, Label } from "./text";

// "OJA SUPPLY CO." lockup: the display wordmark with the small mono line at its baseline.
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", gap: size * 0.14 }} accessibilityRole="header" accessibilityLabel="Oja Supply Co.">
      <Display size={size} style={{ lineHeight: size * 0.86 }}>
        OJA
      </Display>
      <Label numberOfLines={1} size={Math.max(9, size * 0.11)} style={{ letterSpacing: 1.5, marginBottom: size * 0.02 }}>
        Supply Co.
      </Label>
    </View>
  );
}
