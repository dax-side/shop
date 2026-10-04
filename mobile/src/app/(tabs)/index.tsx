import Feather from "@expo/vector-icons/Feather";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Chip } from "@/components/chip";
import { IconButton } from "@/components/icon-button";
import { Logo } from "@/components/logo";
import { ProductGrid } from "@/components/product-grid";
import { Body, Display, Label } from "@/components/text";
import { useApi } from "@/hooks/use-api";
import { firstName } from "@/lib/format";
import type { Product, Room } from "@/lib/types";
import { useSession } from "@/state/session";
import { useTheme } from "@/theme/theme";

export default function Catalogue() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useSession();
  const [room, setRoom] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const input = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const params = new URLSearchParams();
  if (room) params.set("room", room);
  if (debounced) params.set("q", debounced);
  const { data, error, loading, reload } = useApi<{ rooms: Room[]; products: Product[] }>(`/api/products?${params}`);
  const rooms = data?.rooms ?? [];

  const toggleSearch = () => {
    if (searching) {
      setSearching(false);
      setQuery("");
    } else {
      setSearching(true);
      setTimeout(() => input.current?.focus(), 50);
    }
  };

  const name = firstName(user?.name);
  const header = (
    <View style={{ paddingTop: insets.top + 8 }}>
      <View style={{ paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Logo size={28} />
        <IconButton label={searching ? "Close search" : "Search"} onPress={toggleSearch}>
          <Feather name={searching ? "x" : "search"} size={22} color={colors.ink} />
        </IconButton>
      </View>
      <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
        <Label size={12}>{name ? `Hi, ${name}` : "Welcome"}</Label>
        <Display size={46} style={{ marginTop: 6 }}>
          The catalogue
        </Display>
      </View>
      {searching ? (
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 14,
            height: 44,
            borderWidth: 1.5,
            borderColor: colors.ink,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            gap: 8,
          }}
        >
          <Feather name="search" size={16} color={colors.muted} />
          <TextInput
            ref={input}
            value={query}
            onChangeText={setQuery}
            placeholder="Search pots, mugs, towels…"
            placeholderTextColor={colors.muted}
            returnKeyType="search"
            autoCorrect={false}
            accessibilityLabel="Search the catalogue"
            style={{ flex: 1, fontFamily: "Archivo", fontSize: 15, color: colors.ink, height: "100%" }}
          />
        </View>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        style={{ marginTop: 16, marginBottom: 16, flexGrow: 0 }}
      >
        <Chip label="All" selected={room === null} onPress={() => setRoom(null)} />
        {rooms.map((r) => (
          <Chip key={r.slug} label={r.name} selected={room === r.slug} onPress={() => setRoom(r.slug)} />
        ))}
      </ScrollView>
    </View>
  );

  const empty = (
    <View style={{ padding: 32, alignItems: "center", gap: 12 }}>
      {loading && !data ? (
        <ActivityIndicator color={colors.ink} />
      ) : error ? (
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
        <Body color={colors.muted} style={{ textAlign: "center" }}>
          {debounced ? `Nothing matches “${debounced}”.` : "Nothing here yet."}
        </Body>
      )}
    </View>
  );

  return (
    <ProductGrid
      products={data?.products ?? []}
      header={header}
      empty={empty}
      refreshing={loading && !!data}
      onRefresh={reload}
    />
  );
}
