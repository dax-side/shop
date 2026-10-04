import { createContext, use, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { storage } from "@/lib/storage";

// "Notifications" on the account screen: show a banner when something is added to the bag on the
// website while the app is open.
type SettingsValue = { alerts: boolean; setAlerts: (on: boolean) => void };

const SettingsContext = createContext<SettingsValue | null>(null);
const KEY = "oja.alerts";

export function SettingsProvider({ children }: PropsWithChildren) {
  const [alerts, setAlertsState] = useState(true);

  useEffect(() => {
    storage.get(KEY).then((value) => {
      if (value === "off") setAlertsState(false);
    });
  }, []);

  const setAlerts = useCallback((on: boolean) => {
    setAlertsState(on);
    void storage.set(KEY, on ? "on" : "off");
  }, []);

  const value = useMemo(() => ({ alerts, setAlerts }), [alerts, setAlerts]);
  return <SettingsContext value={value}>{children}</SettingsContext>;
}

export function useSettings() {
  const value = use(SettingsContext);
  if (!value) throw new Error("useSettings must be used inside <SettingsProvider>");
  return value;
}
