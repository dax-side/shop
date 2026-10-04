import type { ReactElement } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import type { Product } from "@/lib/types";
import { useTheme } from "@/theme/theme";
import { ProductCard } from "./product-card";

type Props = {
  products: Product[];
  header?: ReactElement;
  empty?: ReactElement;
  refreshing?: boolean;
  onRefresh?: () => void;
};

// Two-column grid with ink rules between cells, as in the design.
export function ProductGrid({ products, header, empty, refreshing = false, onRefresh }: Props) {
  const { colors } = useTheme();
  return (
    <FlatList
      data={products}
      keyExtractor={(product) => product.slug}
      numColumns={2}
      renderItem={({ item, index }) => <ProductCard product={item} column={index % 2 === 0 ? 0 : 1} />}
      ListHeaderComponent={
        <View>
          {header}
          {products.length ? <View style={{ height: 1, backgroundColor: colors.ink }} /> : null}
        </View>
      }
      ListEmptyComponent={empty}
      ListFooterComponent={products.length % 2 === 1 ? <View /> : null}
      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.ink} /> : undefined}
      contentContainerStyle={{ paddingBottom: 24 }}
      keyboardShouldPersistTaps="handled"
    />
  );
}
