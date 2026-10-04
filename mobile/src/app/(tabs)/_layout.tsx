import { Tabs } from "expo-router";
import { TabBar } from "@/components/tab-bar";
import { useCart } from "@/state/cart";
import { useToast } from "@/state/toast";
import { useTheme } from "@/theme/theme";

export default function TabsLayout() {
  const { colors } = useTheme();
  const { cart } = useCart();
  const toast = useToast();
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.paper } }}
      tabBar={(props) => (
        <TabBar {...props} badges={{ bag: cart?.count ?? 0 }} onHeight={(height) => toast.setOffset(height + 8)} />
      )}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="saved" />
      <Tabs.Screen name="bag" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}
