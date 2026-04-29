import { COLORS, TEXTS } from "@/constants/common";
import { StyleSheet } from "react-native";

export const makeStyles = (Colors: typeof COLORS, isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 20 },

    // 헤더
    today_weather: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    weatherBox: {
      flex: 1,
      width: "100%",
      backgroundColor: Colors.card,
      borderRadius: 12,
      padding: 20,
    },
    weatherBoxText: {
      color: Colors.text,
      fontSize: 14,
      fontWeight: "400",
      flexShrink: 1,
    },

    weatherBigFont: {
      fontSize: TEXTS.title,
      fontWeight: "700",
      color: Colors.text,
    },

    today_text: {
      flexDirection: "row",
      gap: 3,
      fontSize: 14,
      color: Colors.subText,
    },
    dateText: { fontSize: 13, color: Colors.subText, marginBottom: 4 },
    greetingText: { fontSize: 22, fontWeight: "700", color: Colors.text },

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

    // 달력
    calendarWrap: {
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 16,
      borderWidth: 1,
      borderColor: Colors.border,
    },

    // 요약 카드
    summaryCard: {
      backgroundColor: Colors.card,
      borderRadius: 16,
      padding: 18,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    summaryTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 14,
    },
    summaryLabel: { fontSize: 13, color: Colors.subText, marginBottom: 4 },
    summaryPercent: { fontSize: 28, fontWeight: "800", color: Colors.primary },
    summaryStats: { gap: 6, alignItems: "flex-end" },
    statItem: { flexDirection: "row", alignItems: "center", gap: 4 },
    statIcon: { fontSize: 13 },
    statText: { fontSize: 13, color: Colors.subText },
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
    progressSub: { fontSize: 12, color: Colors.subText },

    // 섹션 헤더
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    sectionTitle: { fontSize: 17, fontWeight: "700", color: Colors.text },
    sectionMore: { fontSize: 13, color: Colors.primary },

    // 할 일 아이템
    todoItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: Colors.card,
      borderRadius: 12,
      padding: 14,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    todoLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    todoIcon: { fontSize: 22 },
    todoTime: { fontSize: 12, color: Colors.subText },
    todoName: {
      fontSize: 15,
      fontWeight: "500",
      color: Colors.text,
      marginBottom: 4,
    },
    todoDone: { textDecorationLine: "line-through", color: Colors.subText },
    typeBadge: {
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
      alignSelf: "flex-start",
    },

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

    // 빈 화면
    emptyWrap: { alignItems: "center", paddingVertical: 40 },
    emptyIcon: { fontSize: 40, marginBottom: 12 },
    emptyText: { fontSize: 15, color: Colors.subText, marginBottom: 16 },
    addBtn: {
      backgroundColor: Colors.primary,
      borderRadius: 10,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    addBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#0f1215",
      padding: 20,
    },
    profileCard: {
      flexDirection: "row",
      padding: 20,
      backgroundColor: "#1c2127",
      margin: 15,
      borderRadius: 12,
    },
    avatar: { width: 70, height: 70, borderRadius: 15 },
    profileInfo: { marginLeft: 15, justifyContent: "center" },
    name: { color: "#fff", fontSize: 20, fontWeight: "bold" },
    tier: { color: "#00BFFF", fontSize: 15, fontWeight: "600", marginTop: 3 },
    level: { color: "#777", fontSize: 13, marginTop: 3 },
    subTitle: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
      marginLeft: 20,
      marginBottom: 10,
    },
    matchCard: {
      backgroundColor: "#1c2127",
      marginHorizontal: 15,
      marginBottom: 10,
      padding: 15,
      borderRadius: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    matchMode: { color: "#fff", fontWeight: "bold", fontSize: 14 },
    matchStatus: { color: "#ccc" },
    errorText: { color: "#ff4d4d", fontSize: 15, textAlign: "center" },
    retryBtn: {
      marginTop: 14,
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: "#00BFFF",
      borderRadius: 8,
    },
  });
