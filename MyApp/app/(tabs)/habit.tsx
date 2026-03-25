import { useColors } from "@/hooks/useColors";

import { Text, View } from "react-native";

export default function Habit() {
  const Colors = useColors();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Text style={{ color: Colors.text }}>습관 화면</Text>
    </View>
  );
}
