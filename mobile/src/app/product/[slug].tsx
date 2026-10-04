import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Share, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gallery } from "@/components/gallery";
import { IconButton } from "@/components/icon-button";
import { Body, Display, Label, Mono, Serif } from "@/components/text";
import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api";
import { API_URL } from "@/lib/config";
import { formatNaira } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart } from "@/state/cart";
import { useSaved } from "@/state/saved";
import { useToast } from "@/state/toast";
import { light } from "@/theme/colors";
import { useTheme } from "@/theme/theme";

export default function ProductScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data, error, reload } = useApi<{ product: Product }>(`/api/products/${encodeURIComponent(slug)}`);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const product = data?.product;

  const back = () => (router.canGoBack() ? router.back() : router.replace("/"));

  if (!product) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <View style={{ paddingHorizontal: 8 }}>
          <IconButton label="Back" onPress={back}>
            <Feather name="arrow-left" size={24} color={colors.ink} />
          </IconButton>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
          {error ? (
            <>
              <Body color={colors.muted} style={{ textAlign: "center" }}>
                {error}
              </Body>
              <Pressable onPress={reload} accessibilityRole="button">
                <Body weight="semibold" style={{ textDecorationLine: "underline" }}>
                  Try again
                </Body>
              </Pressable>
            </>
          ) : (
            <ActivityIndicator color={colors.ink} />
          )}
        </View>
      </View>
    );
  }

  return <ProductDetails product={product} onBack={back} />;
}

function ProductDetails({ product, onBack }: { product: Product; onBack: () => void }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { cart, add } = useCart();
  const { isSaved, toggle } = useSaved();
  const toast = useToast();
  const [finish, setFinish] = useState(product.finishes[0]?.name);
  const [adding, setAdding] = useState(false);
  const saved = isSaved(product.slug);
  // Photos and their backgrounds are light, so the overlay icons stay dark in both themes.
  const overlay = light.ink;

  async function addToBag() {
    setAdding(true);
    try {
      await add(product.slug, finish);
      toast.show({
        message: `${product.name} added to your bag`,
        action: { label: "View bag", onPress: () => router.navigate("/bag") },
      });
    } catch (cause) {
      toast.show({ message: cause instanceof ApiError ? cause.message : "Couldn't add that. Try again." });
    } finally {
      setAdding(false);
    }
  }

  const share = () =>
    void Share.share({
      message: `${product.name}, ${formatNaira(product.price)} at Oja Supply Co. ${API_URL}/products/${product.slug}`,
    });

  const details = [
    ["Material", product.details.material],
    ["Size", product.details.size],
    ["Care", product.details.care],
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View>
          <Gallery product={product} height={Math.round(400 + insets.top * 0.3)} />
          <View
            style={{
              position: "absolute",
              top: insets.top + 4,
              left: 8,
              right: 8,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <IconButton label="Back" onPress={onBack}>
              <Feather name="arrow-left" size={24} color={overlay} />
            </IconButton>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <IconButton label="Share" onPress={share}>
                <Feather name="share-2" size={21} color={overlay} />
              </IconButton>
              <IconButton label={saved ? "Remove from saved" : "Save"} onPress={() => toggle(product)}>
                {saved ? (
                  <Ionicons name="heart" size={23} color={light.accent} />
                ) : (
                  <Feather name="heart" size={21} color={overlay} />
                )}
              </IconButton>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <Label>
            No. {product.number} · {product.roomName}
          </Label>
          <Display size={44} style={{ marginTop: 8 }}>
            {product.name}
          </Display>
          <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginTop: 8, gap: 12 }}>
            <Serif size={20} color={colors.muted} style={{ flex: 1 }}>
              {product.material}
            </Serif>
            <Mono size={20}>{formatNaira(product.price)}</Mono>
          </View>
          <View style={{ height: 1.5, backgroundColor: colors.ink, marginTop: 14 }} />

          {product.finishes.length ? (
            <>
              <Label style={{ marginTop: 18 }}>Finish — {finish}</Label>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                {product.finishes.map((option) => {
                  const selected = option.name === finish;
                  return (
                    <Pressable
                      key={option.name}
                      onPress={() => setFinish(option.name)}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        paddingVertical: 7,
                        paddingLeft: 7,
                        paddingRight: 12,
                        borderRadius: 8,
                        borderWidth: selected ? 1.5 : 1,
                        borderColor: selected ? colors.ink : colors.line,
                      }}
                    >
                      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: option.swatch }} />
                      <Body size={14}>{option.name}</Body>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}

          <Body style={{ marginTop: 18 }}>{product.description}</Body>

          <View style={{ marginTop: 20, borderTopWidth: 1, borderColor: colors.line }}>
            {details.map(([label, value]) => (
              <View key={label} style={{ flexDirection: "row", gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.line }}>
                <Label color={colors.muted} style={{ width: 80, paddingTop: 2 }}>
                  {label}
                </Label>
                <Body size={14} style={{ flex: 1 }}>
                  {value}
                </Body>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          gap: 12,
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: Math.max(insets.bottom, 14),
          borderTopWidth: 1.5,
          borderColor: colors.ink,
          backgroundColor: colors.paper,
        }}
      >
        <Pressable
          onPress={() => router.navigate("/bag")}
          accessibilityRole="button"
          accessibilityLabel={`Bag, ${cart?.count ?? 0} items`}
          style={{ width: 56, height: 56, borderRadius: 12, borderWidth: 1.5, borderColor: colors.ink, alignItems: "center", justifyContent: "center" }}
        >
          <Feather name="shopping-bag" size={20} color={colors.ink} />
          {cart?.count ? (
            <View
              style={{
                position: "absolute",
                top: -7,
                right: -7,
                minWidth: 20,
                height: 20,
                borderRadius: 10,
                paddingHorizontal: 5,
                backgroundColor: colors.accent,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Body size={11} weight="semibold" color={colors.onAccent} style={{ lineHeight: 14 }}>
                {cart.count}
              </Body>
            </View>
          ) : null}
        </Pressable>
        <Pressable
          onPress={addToBag}
          disabled={adding}
          accessibilityRole="button"
          style={({ pressed }) => ({
            flex: 1,
            height: 56,
            borderRadius: 12,
            backgroundColor: colors.ink,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed || adding ? 0.85 : 1,
          })}
        >
          {adding ? (
            <ActivityIndicator color={colors.paper} />
          ) : (
            <Body size={16} weight="semibold" color={colors.paper}>
              Add to bag
            </Body>
          )}
        </Pressable>
      </View>
    </View>
  );
}
