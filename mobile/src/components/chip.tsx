import Feather from "@expo/vector-icons/Feather";
import { Pressable } from "react-native";
import { useTheme } from "@/theme/theme";
import { Body } from "./text";

// Room filter chip; the selected one is filled with a check mark.
export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={{
        height: 34,
        paddingHorizontal: 13,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: colors.ink,
        backgroundColor: selected ? colors.ink : "transparent",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      {selected ? <Feather name="check" size={14} color={colors.paper} /> : null}
      <Body size={14} color={selected ? colors.paper : colors.ink}>
        {label}
      </Body>
    </Pressable>
  );
}
