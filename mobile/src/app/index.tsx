import { View } from "react-native";
import { Button } from "@/components/button";
import { Display } from "@/components/text";
import { useSession } from "@/state/session";

export default function Home() {
  const { user, signOut } = useSession();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 24, padding: 24 }}>
      <Display>Hi, {user?.name ?? "there"}</Display>
      <Button variant="outline" onPress={signOut}>
        Sign out
      </Button>
    </View>
  );
}
