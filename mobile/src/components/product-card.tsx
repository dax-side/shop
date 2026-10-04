import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, View, useWindowDimensions } from "react-native";
import { formatNaira } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useTheme } from "@/theme/theme";
import { Body, Label, Mono } from "./text";

// One cell of the two-column catalogue grid. The grid draws the ink rules between cells.
// Sizes are explicit: flex and aspectRatio collapsed the cells to zero width on Android.
export function ProductCard({ product, column }: { product: Product; column: 0 | 1 }) {
  const { colors } = useTheme();
  const { width: screen } = useWindowDimensions();
  const cell = Math.floor(screen / 2);
  const imageSize = cell - 24 - (column === 0 ? 1 : 0);
  const image = product.images[0];
  return (
    <Pressable
      onPress={() => router.push(`/product/${product.slug}`)}
      accessibilityRole="link"
      accessibilityLabel={`${product.name}, ${formatNaira(product.price)}`}
      style={({ pressed }) => ({
        width: cell,
        padding: 12,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderRightWidth: column === 0 ? 1 : 0,
        borderColor: colors.ink,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View style={{ width: imageSize, height: imageSize, backgroundColor: product.tone }}>
        {image ? (
          <Image source={image.thumb} alt={image.alt} style={{ width: imageSize, height: imageSize }} contentFit="cover" transition={150} cachePolicy="memory-disk" />
        ) : null}
        {product.isNew ? (
          <View style={{ position: "absolute", top: 8, left: 8, backgroundColor: colors.accent, paddingHorizontal: 6, paddingVertical: 3 }}>
            <Label size={10} color={colors.onAccent}>
              New
            </Label>
          </View>
        ) : null}
      </View>
      <Body size={15} weight="semibold" style={{ marginTop: 10 }} numberOfLines={2}>
        {product.name}
      </Body>
      <Mono size={13} style={{ marginTop: 4 }}>
        {formatNaira(product.price)}
      </Mono>
    </Pressable>
  );
}
