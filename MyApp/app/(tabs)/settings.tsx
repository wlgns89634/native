import { useColors } from "@/hooks/useColors";
import { useThemeStore } from "@/store/useThemeStore";
import { Switch, Text, View } from "react-native";

export default function Settings() {
  const { isDark, toggleTheme } = useThemeStore();
  const Colors = useColors();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 20 }}>
      <Text style={{ color: Colors.text, fontSize: 18 }}>설정</Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ color: Colors.text }}>다크모드</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ true: Colors.primary }}
        />
      </View>
    </View>
  );
}
