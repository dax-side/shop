import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { Animated, Pressable, View } from "react-native";
import { Body } from "@/components/text";
import { useTheme } from "@/theme/theme";

type Toast = { id: number; message: string; action?: { label: string; onPress: () => void } };
type ToastValue = { show: (toast: Omit<Toast, "id">) => void; setOffset: (bottom: number) => void };

const ToastContext = createContext<ToastValue | null>(null);
const SHOW_MS = 4500;

// A dark banner above the tab bar ("Stoneware mug added on the website · View bag").
export function ToastProvider({ children }: PropsWithChildren) {
  const { colors, scheme } = useTheme();
  const dark = scheme === "dark";
  const fg = dark ? colors.ink : colors.paper;
  const [toast, setToast] = useState<Toast | null>(null);
  const [offset, setOffset] = useState(96);
  const [opacity] = useState(() => new Animated.Value(0));
  const nextId = useRef(1);

  const show = useCallback((next: Omit<Toast, "id">) => setToast({ ...next, id: nextId.current++ }), []);

  useEffect(() => {
    if (!toast) return;
    Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }).start(() =>
        setToast((current) => (current?.id === toast.id ? null : current)),
      );
    }, SHOW_MS);
    return () => clearTimeout(timer);
  }, [toast, opacity]);

  const value = useMemo(() => ({ show, setOffset }), [show]);

  return (
    <ToastContext value={value}>
      {children}
      {toast ? (
        <Animated.View
          accessibilityLiveRegion="polite"
          style={{ position: "absolute", left: 12, right: 12, bottom: offset, opacity }}
        >
          <View
            style={{
              backgroundColor: dark ? colors.surface : colors.ink,
              borderWidth: dark ? 1 : 0,
              borderColor: colors.line,
              borderRadius: 4,
              minHeight: 56,
              paddingHorizontal: 16,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              shadowColor: "#000",
              shadowOpacity: 0.18,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 6,
            }}
          >
            <Body size={14} color={fg} style={{ flex: 1 }}>
              {toast.message}
            </Body>
            {toast.action ? (
              <Pressable
                accessibilityRole="button"
                hitSlop={10}
                onPress={() => {
                  toast.action?.onPress();
                  setToast(null);
                }}
              >
                <Body size={14} weight="semibold" color={fg}>
                  {toast.action.label}
                </Body>
              </Pressable>
            ) : null}
          </View>
        </Animated.View>
      ) : null}
    </ToastContext>
  );
}

export function useToast() {
  const value = use(ToastContext);
  if (!value) throw new Error("useToast must be used inside <ToastProvider>");
  return value;
}
