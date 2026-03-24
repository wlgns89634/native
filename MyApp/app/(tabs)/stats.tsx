// stats.tsx
import { Colors } from "@/constants/colors";
import { Text, View } from "react-native";

export default function StatsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Text style={{ color: Colors.text }}>통계 화면</Text>
    </View>
  );
}
