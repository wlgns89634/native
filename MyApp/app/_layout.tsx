import "@/config/calendarLocale";
import { supabase } from "@/lib/supabase";
import { useThemeStore } from "@/store/useThemeStore";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen"; // 1. 스플래시 라이브러리 임포트
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react"; // useState 추가
import { GestureHandlerRootView } from "react-native-gesture-handler";

// 2. 앱이 준비될 때까지 스플래시 화면 자동 숨김 방지
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "메뉴",
};

// ... (Notifications 설정 및 관련 함수들은 기존과 동일하게 유지)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const requestPermission = async (): Promise<boolean> => {
  if (!Device.isDevice) return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

const registerTodoNotifications = async () => {
  const today = new Date().toISOString().split("T")[0];
  const { data: todos } = await supabase
    .from("todos")
    .select("id, title, date, time")
    .gte("date", today);

  if (!todos) return;

  for (const todo of todos) {
    if (!todo.time) continue;
    const [hour, minute] = todo.time.split(":").map(Number);
    const trigger = new Date(todo.date);
    trigger.setHours(hour, minute, 0, 0);
    if (trigger <= new Date()) continue;

    await Notifications.scheduleNotificationAsync({
      identifier: `todo-${todo.id}`,
      content: { title: "📅 일정 알림", body: todo.title },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: trigger,
      },
    });
  }
};

const registerHabitNotifications = async () => {
  const { data: habits } = await supabase
    .from("habits")
    .select("id, name, icon, time");

  if (!habits) return;

  for (const habit of habits) {
    if (!habit.time) continue;
    const [hour, minute] = habit.time.split(":").map(Number);
    await Notifications.scheduleNotificationAsync({
      identifier: `habit-${habit.id}`,
      content: {
        title: "✨ 습관 알림",
        body: `${habit.icon ?? ""} ${habit.name}`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour,
        minute,
        repeats: true,
      },
    });
  }
};

const initNotifications = async () => {
  const granted = await requestPermission();
  if (!granted) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Promise.all([
    registerTodoNotifications(),
    registerHabitNotifications(),
  ]);
};

export default function RootLayout() {
  const { isDark } = useThemeStore();
  const [appIsReady, setAppIsReady] = useState(false); // 3. 준비 상태 관리

  useEffect(() => {
    async function prepare() {
      try {
        // 4. 알림 초기화 및 필요한 모든 준비 작업을 여기서 수행
        await initNotifications();

        // 추가로 필요한 로딩(예: 폰트 로드 등)이 있다면 여기서 await 하세요.
        // 예: await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // 5. 작업이 완료되면 상태 변경
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // 6. 준비가 완료되었을 때만 스플래시를 숨김
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // 준비가 안 되었을 때 null을 리턴하면 스플래시 화면이 계속 유지됩니다.
  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="habit-add" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style={isDark ? "light" : "dark"} />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
