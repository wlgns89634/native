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

    // 습관 카드
    habitCard: {
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

    deleteAction: {
      backgroundColor: Colors.error || "#FF5252", // 실패/에러용 레드 색상
      justifyContent: "center",
      alignItems: "center",
      width: 80,
      // 중요: 카드와 동일한 높이와 여백을 가져야 일체감이 생깁니다.
      height: 80, // habitCard의 높이가 고정이라면 그 값에 맞추세요
      borderRadius: 12, // habitCard와 동일한 곡률
      marginBottom: 12, // habitCard 사이의 간격과 동일하게 설정
      marginLeft: 10, // 카드와 삭제 버튼 사이의 미세한 간격
    },

    deleteText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
    },

    // Swipeable 컨테이너가 잘리지 않게 하려면 추가
    swipeContainer: {
      overflow: "visible",
    },
  });
