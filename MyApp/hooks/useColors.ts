import { DarkColors, LightColors } from "@/constants/colors";
import { useThemeStore } from "@/store/useThemeStore";

export const useColors = () => {
  const { isDark } = useThemeStore();
  return isDark ? DarkColors : LightColors;
};
