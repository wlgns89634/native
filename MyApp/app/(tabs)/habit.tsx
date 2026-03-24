import { Colors } from "@/constants/colors";
import { Text, View } from "react-native";

export default function HabitScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Text style={{ color: Colors.text }}>습관 화면</Text>
    </View>
  );
}
