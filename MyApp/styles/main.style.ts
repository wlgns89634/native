import { COLORS } from "@/constants/common";
import { StyleSheet } from "react-native";

// main.style.ts는 메인 화면 전용 스타일만 포함
// 공통 스타일은 common.style.ts의 CommonStyles 사용
export const MakeStyles = (Colors: typeof COLORS, isDark: boolean) =>
  StyleSheet.create({
    // ── 날씨 박스 ─────────────────────────────────────
    weatherBox: {
      width: "100%",
    },
    weatherBoxText: {
      color: Colors.text,
      fontSize: 14,
      fontWeight: "400",
      flexShrink: 1,
    },
    weatherBigFont: {
      fontSize: 28,
      fontWeight: "700",
      color: Colors.text,
    },
    today_text: {
      flexDirection: "row",
      gap: 3,
      marginBottom: 10,
    },
    today_weather: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    // ── 달력 ──────────────────────────────────────────
    calendarWrap: {
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: Colors.border,
    },

    // ── 요약 카드 ─────────────────────────────────────
    summaryCard: {
      backgroundColor: Colors.card,
      borderRadius: 16,
      padding: 18,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    summaryTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 14,
      marginTop: 12,
    },
    summaryLabel: {
      fontSize: 13,
      color: Colors.subText,
      marginBottom: 4,
    },
    summaryPercent: {
      fontSize: 28,
      fontWeight: "800",
      color: Colors.primary,
    },
    summaryStats: {
      gap: 6,
      alignItems: "flex-end",
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    statIcon: { fontSize: 13 },
    statText: {
      fontSize: 13,
      color: Colors.subText,
    },

    // ── 프로그레스 바 (요약카드 내부용) ──────────────
    progressBg: {
      height: 8,
      backgroundColor: isDark ? "#2C2C2C" : "#E0E0E0",
      borderRadius: 4,
      marginBottom: 8,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: Colors.primary,
      borderRadius: 4,
    },

    // ── 동기부여 메시지 ───────────────────────────────
    motivationWrap: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 10,
      backgroundColor: isDark ? "#1a1a2e" : "#f0efff",
      borderRadius: 8,
      padding: 10,
    },
    motivationEmoji: { fontSize: 16 },
    motivationText: {
      fontSize: 13,
      color: Colors.primary,
      fontWeight: "500",
      flex: 1,
    },

    // ── 스트릭 배지 ───────────────────────────────────
    streakBadge: {
      backgroundColor: Colors.card,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      alignItems: "center",
      borderWidth: 1,
      borderColor: Colors.border,
    },
    streakIcon: { fontSize: 18 },
    streakText: {
      fontSize: 12,
      color: Colors.primary,
      fontWeight: "700",
      marginTop: 2,
    },

    // ── 롤 프로필 카드 ────────────────────────────────
    profileCard: {
      flexDirection: "row",
      padding: 20,
      backgroundColor: Colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    avatar: {
      width: 70,
      height: 70,
      borderRadius: 15,
    },
    profileInfo: {
      justifyContent: "center",
      marginLeft: 16,
    },
    name: {
      color: Colors.text,
      fontSize: 20,
      fontWeight: "bold",
    },
    tier: {
      color: Colors.primary,
      fontSize: 15,
      fontWeight: "600",
      marginTop: 3,
    },
    level: {
      color: Colors.subText,
      fontSize: 13,
      marginTop: 3,
    },
    champBox: {
      flex: 1,
    },

    // ── 매치 카드 ─────────────────────────────────────
    matchCard: {
      backgroundColor: Colors.card,
      marginBottom: 10,
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.border,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    matchMode: {
      color: Colors.text,
      fontWeight: "bold",
      fontSize: 14,
    },
    matchStatus: {
      color: Colors.subText,
      fontSize: 12,
    },

    // ── 에러/로딩 ─────────────────────────────────────
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Colors.background,
      padding: 20,
    },
    dateText: {
      fontSize: 13,
      color: Colors.subText,
    },
    errorText: {
      color: "#ff4d4d",
      fontSize: 15,
      textAlign: "center",
    },
    retryBtn: {
      marginTop: 14,
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: Colors.primary,
      borderRadius: 8,
    },
  });
