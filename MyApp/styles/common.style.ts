import { StyleSheet } from "react-native";

export const makeStyles = (Colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 20 },

    // 헤더
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
      marginTop: 8,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: Colors.text,
      marginBottom: 4,
    },
    headerSub: {
      fontSize: 14,
      color: Colors.subText,
    },
    countBadge: {
      backgroundColor: Colors.card,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    countText: {
      fontSize: 22,
      fontWeight: "800",
      color: Colors.primary,
    },
    countTotal: {
      fontSize: 16,
      fontWeight: "400",
      color: Colors.subText,
    },

    // 달성률 바
    progressWrap: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 24,
    },
    progressBg: {
      flex: 1,
      height: 8,
      backgroundColor: isDark ? "#2C2C2C" : "#E0E0E0",
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: Colors.primary,
      borderRadius: 4,
    },
    progressText: {
      fontSize: 13,
      fontWeight: "700",
      color: Colors.primary,
      width: 36,
      textAlign: "right",
    },

    // 공통 카드
    commonCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: Colors.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    habitCardDone: {
      opacity: 0.6,
    },
    habitLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    iconWrap: {
      width: 46,
      height: 46,
      borderRadius: 12,
      backgroundColor: isDark ? "#2C2C2C" : "#F0F0F0",
      justifyContent: "center",
      alignItems: "center",
    },
    iconWrapDone: {
      backgroundColor: "#6C63FF22",
    },
    habitIcon: { fontSize: 22 },
    habitName: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.text,
      marginBottom: 4,
    },
    habitNameDone: {
      textDecorationLine: "line-through",
      color: Colors.subText,
    },
    habitMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    habitTime: {
      fontSize: 12,
      color: Colors.subText,
    },
    habitStreak: {
      fontSize: 12,
      color: Colors.primary,
      fontWeight: "600",
    },

    // 체크박스
    checkbox: {
      width: 26,
      height: 26,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: Colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxDone: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
    },
    checkmark: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "700",
    },

    // 빈 화면
    emptyWrap: {
      alignItems: "center",
      paddingVertical: 80,
    },
    emptyIcon: { fontSize: 56, marginBottom: 16 },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: Colors.text,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: Colors.subText,
      textAlign: "center",
    },

    // 플로팅 버튼
    fab: {
      position: "absolute",
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: Colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 8,
      zIndex: 999,
    },
    fabText: {
      color: "#fff",
      fontSize: 28,
      fontWeight: "300",
      lineHeight: 32,
    },

    // 삭제 액션
    deleteAction: {
      backgroundColor: Colors.error || "#FF5252",
      justifyContent: "center",
      alignItems: "center",
      width: 80,
      height: 80,
      borderRadius: 12,
      marginBottom: 12,
      marginLeft: 10,
    },
    deleteText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
    },
    swipeContainer: {
      overflow: "visible",
    },

    // ── 운동(Workout) 전용 ──────────────────────────

    // 루틴 카드
    workoutCard: {
      backgroundColor: Colors.card,
      borderRadius: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: Colors.border,
      overflow: "hidden",
    },
    workoutHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
    },
    workoutLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      flex: 1,
    },
    workoutIcon: { fontSize: 22 },
    workoutName: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.text,
      marginBottom: 4,
    },
    workoutNameDone: {
      textDecorationLine: "line-through",
      color: Colors.subText,
    },
    workoutMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    metaText: { fontSize: 12, color: Colors.subText },
    metaDot: { fontSize: 12, color: Colors.border },
    workoutRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    expandIcon: { fontSize: 10, color: Colors.subText },

    // 종목 리스트
    exerciseList: { paddingHorizontal: 16, paddingBottom: 16 },
    exerciseDivider: {
      height: 1,
      backgroundColor: Colors.border,
      marginBottom: 12,
    },
    tableHeader: {
      flexDirection: "row",
      marginBottom: 8,
    },
    tableHeaderText: {
      flex: 1,
      fontSize: 12,
      fontWeight: "700",
      color: Colors.subText,
      textAlign: "center",
    },
    exerciseRow: {
      flexDirection: "row",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    exerciseName: {
      fontSize: 14,
      color: Colors.text,
      fontWeight: "500",
    },
    exerciseValue: {
      flex: 1,
      fontSize: 14,
      color: Colors.subText,
      textAlign: "center",
    },
  });
