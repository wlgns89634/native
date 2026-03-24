// workout.tsx
import { Colors } from "@/constants/colors";
import { Text, View } from "react-native";

export default function WorkoutScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Text style={{ color: Colors.text }}>운동 화면</Text>
    </View>
  );
}
