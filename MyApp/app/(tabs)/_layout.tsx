import { COLORS } from "@/constants/common";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: COLORS.background,
            borderTopColor: COLORS.border,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.subText,
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.text,
          headerShown: false,
        }}
      >
        <Tabs.Screen name="main" options={{ title: "메인" }} />
        <Tabs.Screen name="workout" options={{ title: "운동" }} />
        <Tabs.Screen name="habit" options={{ title: "습관" }} />
        <Tabs.Screen name="stats" options={{ title: "통계" }} />
        <Tabs.Screen name="settings" options={{ title: "설정" }} />
      </Tabs>
    </SafeAreaView>
  );
}
