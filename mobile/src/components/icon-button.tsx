import type { ReactNode } from "react";
import { Pressable } from "react-native";

export function IconButton({ label, onPress, children }: { label: string; onPress: () => void; children: ReactNode }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={({ pressed }) => ({ padding: 8, opacity: pressed ? 0.6 : 1 })}
    >
      {children}
    </Pressable>
  );
}
