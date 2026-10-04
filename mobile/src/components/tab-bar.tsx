import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { BottomTabBarProps } from "expo-router/tabs";
import type { ReactNode } from "react";
import { Pressable, View, type LayoutChangeEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme/theme";
import { Body } from "./text";

type Props = BottomTabBarProps & {
  badges?: Record<string, number>;
  onHeight?: (height: number) => void;
};

const LABELS: Record<string, string> = { index: "Shop", saved: "Saved", bag: "Bag", account: "Account" };

function icon(name: string, color: string): ReactNode {
  if (name === "index") return <MaterialCommunityIcons name="storefront-outline" size={21} color={color} />;
  const feather = { saved: "heart", bag: "shopping-bag", account: "user" }[name] as "heart" | "shopping-bag" | "user";
  return <Feather name={feather} size={19} color={color} />;
}

// The design's tab bar: the active tab's icon sits in a dark pill; the bag shows a red count.
export function TabBar({ state, navigation, badges = {}, onHeight }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      onLayout={(event: LayoutChangeEvent) => onHeight?.(event.nativeEvent.layout.height)}
      style={{
        flexDirection: "row",
        backgroundColor: colors.bar,
        borderTopWidth: 1,
        borderTopColor: colors.line,
        paddingTop: 10,
        paddingBottom: Math.max(insets.bottom, 10),
      }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const label = LABELS[route.name] ?? route.name;
        const badge = badges[route.name] ?? 0;
        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={badge ? `${label}, ${badge} items` : label}
            style={{ flex: 1, alignItems: "center", gap: 4 }}
          >
            <View
              style={{
                width: 60,
                height: 32,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? colors.ink : "transparent",
              }}
            >
              {icon(route.name, focused ? colors.paper : colors.muted)}
              {badge > 0 ? (
                <View
                  style={{
                    position: "absolute",
                    top: -3,
                    right: 10,
                    minWidth: 17,
                    height: 17,
                    borderRadius: 9,
                    paddingHorizontal: 4,
                    backgroundColor: colors.accent,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Body size={10} weight="semibold" color={colors.onAccent} style={{ lineHeight: 13 }}>
                    {badge > 99 ? "99+" : badge}
                  </Body>
                </View>
              ) : null}
            </View>
            <Body size={12} weight={focused ? "semibold" : "regular"} color={focused ? colors.ink : colors.muted}>
              {label}
            </Body>
          </Pressable>
        );
      })}
    </View>
  );
}
