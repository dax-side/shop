import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { ProductGrid } from "@/components/product-grid";
import { Body, Display, Label } from "@/components/text";
import { useSaved } from "@/state/saved";
import { useTheme } from "@/theme/theme";

export default function Saved() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { products, reload } = useSaved();
  const [refreshing, setRefreshing] = useState(false);

  // Pick up anything saved on another device.
  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  const refresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  const count = products?.length ?? 0;
  const header = (
    <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 16 }}>
      <View style={{ height: 40, justifyContent: "center" }}>
        <Logo size={28} />
      </View>
      <Label size={12} style={{ marginTop: 18 }}>
        {count ? `${count} saved item${count === 1 ? "" : "s"}` : "Your shortlist"}
      </Label>
      <Display size={46} style={{ marginTop: 6 }}>
        Saved
      </Display>
    </View>
  );

  const empty = products ? (
    <View style={{ paddingHorizontal: 16, gap: 16 }}>
      <View style={{ height: 1.5, backgroundColor: colors.ink }} />
      <Body color={colors.muted}>Nothing saved yet. Tap the heart on anything you like and it waits for you here.</Body>
      <Button variant="outline" onPress={() => router.navigate("/")}>
        Browse the catalogue
      </Button>
    </View>
  ) : (
    <ActivityIndicator color={colors.ink} style={{ marginTop: 24 }} />
  );

  return <ProductGrid products={products ?? []} header={header} empty={empty} refreshing={refreshing} onRefresh={refresh} />;
}
