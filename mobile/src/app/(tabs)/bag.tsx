import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { IconButton } from "@/components/icon-button";
import { Stepper } from "@/components/stepper";
import { Body, Display, Label, Mono } from "@/components/text";
import { ApiError } from "@/lib/api";
import { openOnWebsite } from "@/lib/checkout";
import { formatNaira, timeAgo } from "@/lib/format";
import type { CartItem } from "@/lib/types";
import { useCart } from "@/state/cart";
import { useToast } from "@/state/toast";
import { useTheme } from "@/theme/theme";

const DAY = 24 * 60 * 60 * 1000;
const RECENT = 10 * 60 * 1000;

// Ticks every 30 s so "JUST NOW" becomes "2 MIN AGO" while the bag is open.
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

export default function Bag() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { cart, live, setQuantity, remove } = useCart();
  const toast = useToast();
  const now = useNow();
  const [opening, setOpening] = useState(false);

  async function checkout() {
    setOpening(true);
    try {
      await openOnWebsite("/checkout");
    } catch (cause) {
      toast.show({ message: cause instanceof ApiError ? cause.message : "Couldn't open checkout. Try again." });
    } finally {
      setOpening(false);
    }
  }

  const back = () => (router.canGoBack() ? router.back() : router.navigate("/"));
  const items = cart?.items ?? [];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 4, paddingBottom: 24 }}>
        <View style={{ paddingHorizontal: 8 }}>
          <IconButton label="Back" onPress={back}>
            <Feather name="arrow-left" size={24} color={colors.ink} />
          </IconButton>
        </View>
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <Display size={46}>Your bag</Display>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }} accessibilityLiveRegion="polite">
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: live ? colors.ink : colors.muted }} />
            <Label size={11} color={live ? colors.ink : colors.muted}>
              {live ? "Synced with your account · website + app" : "Connecting to your account…"}
            </Label>
          </View>
        </View>
        <View style={{ height: 1.5, backgroundColor: colors.ink, marginTop: 14 }} />

        {!cart ? (
          <ActivityIndicator color={colors.ink} style={{ marginTop: 40 }} />
        ) : items.length === 0 ? (
          <View style={{ padding: 16, paddingTop: 32, gap: 16 }}>
            <Body color={colors.muted}>
              Your bag is empty. Anything you add here or on the website shows up in both places.
            </Body>
            <Button variant="outline" onPress={() => router.navigate("/")}>
              Shop the catalogue
            </Button>
          </View>
        ) : (
          <>
            {items.map((item) => (
              <BagRow
                key={`${item.slug}:${item.finish ?? ""}`}
                item={item}
                now={now}
                onQuantity={(quantity) => setQuantity(item, quantity)}
                onRemove={() => remove(item)}
              />
            ))}
            <View style={{ paddingHorizontal: 16, paddingTop: 18, gap: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Body>
                  Subtotal ({cart.count} item{cart.count === 1 ? "" : "s"})
                </Body>
                <Mono size={15}>{formatNaira(cart.subtotal)}</Mono>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Body color={colors.muted}>Delivery</Body>
                <Body color={colors.muted}>At checkout</Body>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {items.length ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 14 }}>
          <Pressable
            onPress={checkout}
            disabled={opening}
            accessibilityRole="button"
            style={({ pressed }) => ({
              height: 54,
              borderRadius: 12,
              backgroundColor: colors.ink,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed || opening ? 0.85 : 1,
            })}
          >
            {opening ? (
              <ActivityIndicator color={colors.paper} />
            ) : (
              <Body size={16} weight="semibold" color={colors.paper}>
                Checkout · {formatNaira(cart?.subtotal ?? 0)}
              </Body>
            )}
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function BagRow({ item, now, onQuantity, onRemove }: { item: CartItem; now: number; onQuantity: (q: number) => void; onRemove: () => void }) {
  const { colors } = useTheme();
  const age = now - Date.parse(item.addedAt);
  const fromWebsite = item.addedFrom === "web" && age < DAY;
  const highlight = fromWebsite && age < RECENT;
  const when = timeAgo(item.addedAt, now);

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 14,
        padding: 16,
        borderBottomWidth: 1.5,
        borderColor: colors.line,
        backgroundColor: highlight ? colors.surface : "transparent",
      }}
    >
      <Pressable onPress={() => router.push(`/product/${item.slug}`)} accessibilityLabel={`Open ${item.name}`}>
        <View style={{ width: 76, height: 76, backgroundColor: item.tone }}>
          {item.image ? <Image source={item.image} style={{ flex: 1 }} contentFit="cover" cachePolicy="memory-disk" /> : null}
        </View>
      </Pressable>
      <View style={{ flex: 1 }}>
        {fromWebsite ? (
          <View
            style={{
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: colors.accent,
              paddingHorizontal: 7,
              paddingVertical: 3,
              marginBottom: 6,
            }}
          >
            <Feather name="monitor" size={10} color={colors.onAccent} />
            <Label size={10} color={colors.onAccent}>
              Added on website · {when === "now" ? "just now" : when}
            </Label>
          </View>
        ) : null}
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
          <Body size={16} weight="semibold" style={{ flex: 1 }} numberOfLines={2}>
            {item.name}
          </Body>
          <Mono size={14}>{formatNaira(item.lineTotal)}</Mono>
        </View>
        <Mono size={12} color={colors.muted} style={{ marginTop: 2 }}>
          {item.finish || item.material} · {formatNaira(item.price)} each
        </Mono>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
          <Stepper value={item.quantity} onChange={onQuantity} label={item.name} />
          <IconButton label={`Remove ${item.name}`} onPress={onRemove}>
            <Feather name="trash-2" size={19} color={colors.ink} />
          </IconButton>
        </View>
      </View>
    </View>
  );
}
