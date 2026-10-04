import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { completeSignIn } from "@/lib/auth";
import { useTheme } from "@/theme/theme";

// The website redirects here (ojasupply://auth?code=…&state=…) after the customer confirms.
// Usually the sign-in screen has already picked the code up; if not, finish signing in here.
export default function AuthRedirect() {
  const { code, state } = useLocalSearchParams();
  const { colors } = useTheme();

  useEffect(() => {
    const exchange = completeSignIn(code, state);
    const leave = () => router.replace("/");
    if (exchange) exchange.then(leave, leave);
    else leave();
  }, [code, state]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.paper }}>
      <ActivityIndicator color={colors.ink} />
    </View>
  );
}
