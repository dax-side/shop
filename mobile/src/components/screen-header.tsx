import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme/theme";
import { IconButton } from "./icon-button";
import { Display } from "./text";

// Back arrow and a display title, for screens pushed on top of the tabs.
export function ScreenHeader({ title }: { title: string }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + 4 }}>
      <View style={{ paddingHorizontal: 8 }}>
        <IconButton label="Back" onPress={() => (router.canGoBack() ? router.back() : router.navigate("/account"))}>
          <Feather name="arrow-left" size={24} color={colors.ink} />
        </IconButton>
      </View>
      <Display size={46} style={{ paddingHorizontal: 16, marginTop: 8 }}>
        {title}
      </Display>
      <View style={{ height: 1.5, backgroundColor: colors.ink, marginTop: 14 }} />
    </View>
  );
}
