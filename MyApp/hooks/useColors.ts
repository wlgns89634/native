import { DARK_COLORS, LIGHT_COLORS } from "@/constants/common";
import { useThemeStore } from "@/store/useThemeStore";

export const useColors = () => {
  const { isDark } = useThemeStore();
  return isDark ? DARK_COLORS : LIGHT_COLORS;
};
