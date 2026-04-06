import { useColors } from "@/hooks/useColors";
import { useAllStore } from "@/store/useAllStore";
import { useThemeStore } from "@/store/useThemeStore";
import { Habit } from "@/types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { makeStyles } from "../../styles/habit.style";

export default function HabitScreen() {
  const Colors = useColors();
  const { isDark } = useThemeStore();
  const [habitData, setHabitData] = useState<Habit[]>([]);
  const styles = makeStyles(Colors, isDark);

  const { habits, fetchHabits, toggleHabit, deleteHabit } = useAllStore();

  useEffect(() => {
    fetchHabits();
  }, []);

  const completedCount = habitData.filter((h) => h.is_completed).length;
  const totalCount = habitData.length;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>습관</Text>
            <Text style={styles.headerSub}>오늘의 습관을 체크해보세요</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {completedCount}
              <Text style={styles.countTotal}>/{totalCount}</Text>
            </Text>
          </View>
        </View>

        {/* 달성률 바 */}
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.round((completedCount / totalCount) * 100)}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {totalCount > 0
              ? Math.round((completedCount / totalCount) * 100)
              : 0}
            %
          </Text>
        </View>

        {/* 습관 리스트 */}
        {habits.map((habit) => (
          <TouchableOpacity
            key={habit.id}
            style={[
              styles.habitCard,
              habit.is_completed && styles.habitCardDone,
            ]}
            activeOpacity={0.7}
            onPress={() => toggleHabit(habit.id, habit.is_completed)}
          >
            {/* 왼쪽 */}
            <View style={styles.habitLeft}>
              <View
                style={[
                  styles.iconWrap,
                  habit.is_completed && styles.iconWrapDone,
                ]}
              >
                <Text style={styles.habitIcon}>{habit.icon}</Text>
              </View>
              <View>
                <Text
                  style={[
                    styles.habitName,
                    habit.is_completed && styles.habitNameDone,
                  ]}
                >
                  {habit.name}
                </Text>
                <View style={styles.habitMeta}>
                  <Text style={styles.habitTime}>⏰ {habit.time}</Text>
                  {habit.streak > 0 && (
                    <Text style={styles.habitStreak}>🔥 {habit.streak}일</Text>
                  )}
                </View>
              </View>
            </View>

            {/* 체크박스 */}
            <View
              style={[
                styles.checkbox,
                habit.is_completed && styles.checkboxDone,
              ]}
            >
              {habit.is_completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))}
        {habitData.length > 0 ? (
          habitData.map((habit) => (
            <TouchableOpacity
              key={habit.id}
              style={[
                styles.habitCard,
                habit.is_completed && styles.habitCardDone,
              ]}
              activeOpacity={0.7}
            >
              {/* 왼쪽 */}
              <View style={styles.habitLeft}>
                <View
                  style={[
                    styles.iconWrap,
                    habit.is_completed && styles.iconWrapDone,
                  ]}
                >
                  <Text style={styles.habitIcon}>{habit.icon}</Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.habitName,
                      habit.is_completed && styles.habitNameDone,
                    ]}
                  >
                    {habit.name}
                  </Text>
                  <View style={styles.habitMeta}>
                    <Text style={styles.habitTime}>⏰ {habit.time}</Text>
                    {habit.streak > 0 && (
                      <Text style={styles.habitStreak}>
                        🔥 {habit.streak}일
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* 체크박스 */}
              <View
                style={[
                  styles.checkbox,
                  habit.is_completed && styles.checkboxDone,
                ]}
              >
                {habit.is_completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          // 빈 화면
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🌱</Text>
            <Text style={styles.emptyTitle}>아직 습관이 없어요</Text>
            <Text style={styles.emptyText}>좋은 습관을 하나씩 만들어봐요</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 플로팅 추가 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push("/habit-add")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
