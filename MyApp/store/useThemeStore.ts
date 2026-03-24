import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
}

const storage =
  Platform.OS === "web"
    ? createJSONStorage(() => localStorage)
    : createJSONStorage(() => AsyncStorage);

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: true,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: "theme-storage",
      storage,
    },
  ),
);
