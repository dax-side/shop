import { createContext, use, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { useColorScheme } from "react-native";
import { storage } from "@/lib/storage";
import { dark, light, type Palette } from "./colors";

type Preference = "system" | "light" | "dark";

type ThemeValue = {
  colors: Palette;
  scheme: "light" | "dark";
  toggle: () => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);
const KEY = "oja.theme";

export function ThemeProvider({ children }: PropsWithChildren) {
  const system = useColorScheme() === "dark" ? "dark" : "light";
  const [preference, setPreference] = useState<Preference>("system");

  useEffect(() => {
    storage.get(KEY).then((value) => {
      if (value === "light" || value === "dark") setPreference(value);
    });
  }, []);

  const scheme = preference === "system" ? system : preference;

  const value = useMemo<ThemeValue>(
    () => ({
      colors: scheme === "dark" ? dark : light,
      scheme,
      toggle: () => {
        const next = scheme === "dark" ? "light" : "dark";
        setPreference(next);
        void storage.set(KEY, next);
      },
    }),
    [scheme],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme() {
  const value = use(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside <ThemeProvider>");
  return value;
}
