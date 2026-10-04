import { Image } from "expo-image";
import { useState } from "react";
import { FlatList, View, useWindowDimensions } from "react-native";
import type { Product } from "@/lib/types";
import { light } from "@/theme/colors";

// Swipeable product photos with the design's dash indicator underneath.
export function Gallery({ product, height }: { product: Product; height: number }) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const images = product.images;

  return (
    <View style={{ height, backgroundColor: product.tone }}>
      <FlatList
        data={images}
        keyExtractor={(image) => image.url}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => setIndex(Math.round(event.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <Image source={item.url} alt={item.alt} style={{ width, height }} contentFit="cover" transition={150} cachePolicy="memory-disk" />
        )}
      />
      {images.length > 1 ? (
        <View
          accessibilityLabel={`Photo ${index + 1} of ${images.length}`}
          style={{ position: "absolute", left: 16, bottom: 16, flexDirection: "row", gap: 5 }}
        >
          {images.map((image, i) => (
            <View
              key={image.url}
              style={{
                width: i === index ? 18 : 8,
                height: 3,
                backgroundColor: i === index ? light.ink : "rgba(23,22,20,0.35)",
              }}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
