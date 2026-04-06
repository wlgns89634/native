import "@/config/calendarLocale";
import { useColors } from "@/hooks/useColors";
import { useThemeStore } from "@/store/useThemeStore";
import { makeStyles } from "@/styles/main.style";
import { TodoData } from "@/types";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
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
  const markedDates: Record<string, any> = {};
  const streakCount = 0;

  const animatedWidth = useRef(new Animated.Value(0)).current;

  const getMotivation = () => {
    if (totalCount === 0)
      return { msg: "오늘 루틴을 등록해보세요!", emoji: "📝" };
    if (percentage === 100)
      return { msg: "완벽해요! 오늘 모두 완료했어요", emoji: "🎉" };
    if (percentage >= 75)
      return { msg: "거의 다 왔어요! 조금만 더!", emoji: "💪" };
    if (percentage >= 50)
      return { msg: "절반 넘었어요! 잘하고 있어요", emoji: "🔥" };
    if (percentage >= 25)
      return { msg: "좋은 시작이에요! 계속 해봐요", emoji: "😊" };
    return { msg: "오늘 루틴 시작해볼까요?", emoji: "🌅" };
  };

  const motivation = getMotivation();

  const selectedItems = todos[selectedDate] || [];
  const completedCount = selectedItems.filter((i) => i.is_completed).length;
  const totalCount = selectedItems.length;
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const habitCount = selectedItems.filter((i) => i.type === "habit").length;
  const habitDone = selectedItems.filter(
    (i) => i.type === "habit" && i.is_completed,
  ).length;
  const workoutCount = selectedItems.filter((i) => i.type === "workout").length;
  const workoutDone = selectedItems.filter(
    (i) => i.type === "workout" && i.is_completed,
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
        item.id === id ? { ...item, is_completed: !item.is_completed } : item,
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
          onDayPress={(day: { dateString: string }) =>
            setSelectedDate(day.dateString)
          }
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
          {/* 동기부여 메세지 */}
          <View style={styles.motivationWrap}>
            <Text style={styles.motivationEmoji}>{motivation.emoji}</Text>
            <Text style={styles.motivationText}>{motivation.msg}</Text>
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
                  style={[
                    styles.todoName,
                    item.is_completed && styles.todoDone,
                  ]}
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
              style={[
                styles.checkbox,
                item.is_completed && styles.checkboxDone,
              ]}
            >
              {item.is_completed && <Text style={styles.checkmark}>✓</Text>}
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
