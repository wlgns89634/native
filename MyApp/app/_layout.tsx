import "@/config/calendarLocale"; // 캘린더 로케일 설정 추가
import { useThemeStore } from "@/store/useThemeStore";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const unstable_settings = {
  anchor: "메뉴",
};

export default function RootLayout() {
  const { isDark } = useThemeStore();

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* 🔹 탭 그룹 먼저 등록 */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* 🔹 모달/추가 화면 */}
          <Stack.Screen name="habit-add" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style={isDark ? "light" : "dark"} />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
