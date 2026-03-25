import "@/config/calendarLocale";
import { useColors } from "@/hooks/useColors";
import { useThemeStore } from "@/store/useThemeStore";
import { TodoData } from "@/types";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

const getDateStr = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
};

const today = new Date();
const todayStr = today.toISOString().split("T")[0];
const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

export default function Main() {
  const Colors = useColors();
  const { isDark } = useThemeStore();
  const styles = makeStyles(Colors, isDark);

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [todos, setTodos] = useState<TodoData>({});
  const markedDates = {};
  const streakCount = 0;

  const animatedWidth = useRef(new Animated.Value(0)).current;

  const selectedItems = todos[selectedDate] || [];
  const completedCount = selectedItems.filter((i) => i.isCompleted).length;
  const totalCount = selectedItems.length;
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const habitCount = selectedItems.filter((i) => i.type === "habit").length;
  const habitDone = selectedItems.filter(
    (i) => i.type === "habit" && i.isCompleted,
  ).length;
  const workoutCount = selectedItems.filter((i) => i.type === "workout").length;
  const workoutDone = selectedItems.filter(
    (i) => i.type === "workout" && i.isCompleted,
  ).length;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: percentage, // 목표값
      duration: 300, // 0.8초
      useNativeDriver: false, // width 애니메이션은 false
    }).start();
  }, [percentage]); // percentage 바뀔때마다 실행

  const toggleTodo = (id: string) => {
    setTodos((prev) => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item,
      ),
    }));
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.dateText}>
            {today.getMonth() + 1}월 {today.getDate()}일{" "}
            {dayNames[today.getDay()]}요일
          </Text>
          <Text style={styles.greetingText}>오늘도 루틴 지켜봐요 💪</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakText}>{streakCount}일</Text>
        </View>
      </View>

      {/* 달력 */}
      <View style={styles.calendarWrap}>
        <Calendar
          current={todayStr}
          onDayPress={(day: any) => setSelectedDate(day.dateString)}
          monthFormat={"yyyy년 MM월"}
          renderArrow={(direction: string) => (
            <Text style={{ color: Colors.primary, fontSize: 18 }}>
              {direction === "left" ? "‹" : "›"}
            </Text>
          )}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              ...(markedDates[selectedDate] || {}),
              selected: true,
              selectedColor: Colors.primary,
            },
          }}
          theme={{
            backgroundColor: Colors.card,
            calendarBackground: Colors.card,
            textSectionTitleColor: Colors.subText,
            selectedDayBackgroundColor: Colors.primary,
            selectedDayTextColor: "#ffffff",
            todayTextColor: Colors.primary,
            dayTextColor: Colors.text,
            textDisabledColor: Colors.border,
            dotColor: Colors.primary,
            selectedDotColor: "#ffffff",
            arrowColor: Colors.primary,
            monthTextColor: Colors.text,
            textDayFontWeight: "500",
            textMonthFontWeight: "700",
            textDayHeaderFontWeight: "600",
            textDayFontSize: 14,
            textMonthFontSize: 16,
          }}
        />
      </View>

      {/* 요약 카드 */}
      {totalCount >= 0 && (
        <View style={styles.summaryCard}>
          {/* 달성률 */}
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryLabel}>
                {selectedDate === todayStr
                  ? "오늘"
                  : selectedDate.slice(5).replace("-", "/")}{" "}
                달성률
              </Text>
              <Text style={styles.summaryPercent}>{percentage}%</Text>
            </View>
            <View style={styles.summaryStats}>
              {/* 습관 요약 */}
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>✅</Text>
                <Text style={styles.statText}>
                  습관 {habitDone}/{habitCount}
                </Text>
              </View>
              {/* 운동 요약 */}
              {workoutCount > 0 && (
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>💪</Text>
                  <Text style={styles.statText}>
                    운동 {workoutDone}/{workoutCount}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* 프로그레스바 */}
          <View style={styles.progressBg}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: animatedWidth.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressSub}>
            {completedCount} / {totalCount} 완료
          </Text>
          <Text style={styles.progressSub}>
            {habitDone} 습관, {workoutDone} 운동 완료
          </Text>
        </View>
      )}

      {/* 할 일 리스트 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedDate === todayStr
            ? "오늘 할 일"
            : `${selectedDate.slice(5).replace("-", "/")} 할 일`}
        </Text>
        {totalCount > 0 && (
          <TouchableOpacity>
            <Text style={styles.sectionMore}>전체보기</Text>
          </TouchableOpacity>
        )}
      </View>

      {totalCount > 0 ? (
        selectedItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.todoItem}
            activeOpacity={0.7}
            onPress={() => toggleTodo(item.id)}
          >
            <View style={styles.todoLeft}>
              <Text style={styles.todoIcon}>{item.icon}</Text>
              <View>
                <Text
                  style={[styles.todoName, item.isCompleted && styles.todoDone]}
                >
                  {item.name}
                </Text>
                {/* 타입 뱃지 */}
                <View
                  style={[
                    styles.typeBadge,
                    {
                      backgroundColor:
                        item.type === "habit" ? "#6C63FF22" : "#FF658422",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeBadgeText,
                      {
                        color:
                          item.type === "habit"
                            ? Colors.primary
                            : Colors.secondary,
                      },
                    ]}
                  >
                    {item.type === "habit" ? "습관" : "운동"}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[styles.checkbox, item.isCompleted && styles.checkboxDone]}
            >
              {item.isCompleted && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>이 날은 일정이 없어요</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ 일정 추가</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const makeStyles = (Colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 20 },

    // 헤더
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      marginTop: 8,
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
    typeBadgeText: { fontSize: 11, fontWeight: "600" },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: Colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxDone: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
    },
    checkmark: { color: "#fff", fontSize: 13, fontWeight: "700" },

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
  });
