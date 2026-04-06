import "@/config/calendarLocale"; // 캘린더 로케일 설정 추가
import { useThemeStore } from "@/store/useThemeStore";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export const unstable_settings = {
  anchor: "메뉴",
};

export default function RootLayout() {
  const { isDark } = useThemeStore();

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false, // ← 모든 화면 헤더 숨김
        }}
      >
        <Stack.Screen
          name="habit-add"
          options={{ headerShown: false }} // ← 이거 추가!
        />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </ThemeProvider>
  );
}
