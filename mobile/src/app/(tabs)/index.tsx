import { View } from "react-native";
import { Display } from "@/components/text";

export default function Screen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Display>index</Display>
    </View>
  );
}
