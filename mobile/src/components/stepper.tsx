import Feather from "@expo/vector-icons/Feather";
import { Pressable, View } from "react-native";
import { useTheme } from "@/theme/theme";
import { Mono } from "./text";

export function Stepper({ value, min = 1, max = 20, onChange, label }: { value: number; min?: number; max?: number; onChange: (value: number) => void; label: string }) {
  const { colors } = useTheme();
  const button = (icon: "minus" | "plus", next: number, disabled: boolean, a11y: string) => (
    <Pressable
      onPress={() => onChange(next)}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      hitSlop={6}
      style={{ width: 38, height: "100%", alignItems: "center", justifyContent: "center", opacity: disabled ? 0.3 : 1 }}
    >
      <Feather name={icon} size={16} color={colors.ink} />
    </Pressable>
  );
  return (
    <View
      accessibilityLabel={`${label}: ${value}`}
      style={{ flexDirection: "row", alignItems: "center", height: 40, borderWidth: 1.5, borderColor: colors.ink, borderRadius: 8 }}
    >
      {button("minus", value - 1, value <= min, `Fewer ${label}`)}
      <Mono size={15} style={{ minWidth: 28, textAlign: "center" }}>
        {value}
      </Mono>
      {button("plus", value + 1, value >= max, `More ${label}`)}
    </View>
  );
}
