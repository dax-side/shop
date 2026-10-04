import Feather from "@expo/vector-icons/Feather";
import { Pressable } from "react-native";
import { useTheme } from "@/theme/theme";
import { Body } from "./text";

export function MenuRow({ label, value, onPress, last }: { label: string; value?: string; onPress: () => void; last?: boolean }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        minHeight: 54,
        gap: 10,
        borderBottomWidth: last ? 0 : 1.5,
        borderColor: colors.line,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Body style={{ flex: 1 }}>{label}</Body>
      {value ? <Body color={colors.muted}>{value}</Body> : null}
      <Feather name="chevron-right" size={18} color={colors.ink} />
    </Pressable>
  );
}
