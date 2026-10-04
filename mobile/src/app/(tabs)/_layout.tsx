import { Tabs } from "expo-router";
import { TabBar } from "@/components/tab-bar";
import { useTheme } from "@/theme/theme";

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.paper } }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="saved" />
      <Tabs.Screen name="bag" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}
