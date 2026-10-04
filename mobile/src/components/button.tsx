import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "@/theme/theme";
import { Body } from "./text";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  variant?: "solid" | "outline";
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

// Full-width pill buttons: solid ink for the main action, outlined for the secondary one.
export function Button({ children, onPress, variant = "solid", icon, loading, disabled, style, accessibilityLabel }: Props) {
  const { colors } = useTheme();
  const solid = variant === "solid";
  const fg = solid ? colors.paper : colors.ink;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={({ pressed }) => [
        {
          height: 54,
          borderRadius: 27,
          borderWidth: 1.5,
          borderColor: colors.ink,
          backgroundColor: solid ? colors.ink : "transparent",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 10,
          paddingHorizontal: 20,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon ? <View>{icon}</View> : null}
          <Body size={16} weight="medium" color={fg}>
            {children}
          </Body>
        </>
      )}
    </Pressable>
  );
}
