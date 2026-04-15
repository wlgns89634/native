import { useColors } from "@/hooks/useColors";
import { useAllStore } from "@/store/useAllStore";
import { useThemeStore } from "@/store/useThemeStore";
import { Exercise } from "@/types";
import { router } from "expo-router";

import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 예상 시간 계산 (세트 * 종목 * 2분)
const calcTime = (exercises: Exercise[]) => {
  const totalSets = exercises.reduce((acc, e) => acc + e.sets, 0);
  return totalSets * 2;
};

export default function WorkoutScreen() {
  const Colors = useColors();
  const { isDark } = useThemeStore();
  const styles = makeStyles(Colors, isDark);

  const { workouts, fetchWorkouts, toggleWorkout } = useAllStore();

  // 더미데이터 useState 삭제하고 스토어로 교체
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const completedCount = workouts.filter(
    (w: { isCompleted: boolean }) => w.isCompleted,
  ).length;
  const totalCount = workouts.length;

  const animatedWidth = useRef(new Animated.Value(0)).current;

  const toggleComplete = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue:
        totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [completedCount, totalCount]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>운동</Text>
            <Text style={styles.headerSub}>오늘의 루틴을 완료해보세요</Text>
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
          <Text style={styles.progressText}>
            {totalCount > 0
              ? `${Math.round((completedCount / totalCount) * 100)}%`
              : "0%"}
          </Text>
        </View>

        {/* 루틴 리스트 */}
        {workouts.length > 0 ? (
          workouts.map((workout) => (
            <View key={workout.id} style={styles.workoutCard}>
              {/* 루틴 헤더 */}
              <TouchableOpacity
                style={styles.workoutHeader}
                activeOpacity={0.7}
                onPress={() => toggleExpand(workout.id)}
              >
                <View style={styles.workoutLeft}>
                  <View
                    style={[
                      styles.iconWrap,
                      workout.isCompleted && styles.iconWrapDone,
                    ]}
                  >
                    <Text style={styles.workoutIcon}>{workout.icon}</Text>
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.workoutName,
                        workout.isCompleted && styles.workoutNameDone,
                      ]}
                    >
                      {workout.name}
                    </Text>
                    <View style={styles.workoutMeta}>
                      <Text style={styles.metaText}>
                        🏃 {workout.exercises.length}종목
                      </Text>
                      <Text style={styles.metaDot}>·</Text>
                      <Text style={styles.metaText}>
                        ⏱ 약 {calcTime(workout.exercises)}분
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.workoutRight}>
                  {/* 완료 체크 */}
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      workout.isCompleted && styles.checkboxDone,
                    ]}
                    onPress={() => toggleComplete(workout.id)}
                  >
                    {workout.isCompleted && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                  {/* 펼치기 */}
                  <Text style={styles.expandIcon}>
                    {expandedId === workout.id ? "▲" : "▼"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* 종목 리스트 (펼쳐질 때) */}
              {expandedId === workout.id && (
                <View style={styles.exerciseList}>
                  <View style={styles.exerciseDivider} />
                  {/* 테이블 헤더 */}
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>
                      종목
                    </Text>
                    <Text style={styles.tableHeaderText}>세트</Text>
                    <Text style={styles.tableHeaderText}>횟수</Text>
                    <Text style={styles.tableHeaderText}>무게</Text>
                  </View>
                  {workout.exercises.map((exercise) => (
                    <View key={exercise.id} style={styles.exerciseRow}>
                      <Text style={[styles.exerciseName, { flex: 2 }]}>
                        {exercise.name}
                      </Text>
                      <Text style={styles.exerciseValue}>{exercise.sets}</Text>
                      <Text style={styles.exerciseValue}>{exercise.reps}</Text>
                      <Text style={styles.exerciseValue}>
                        {exercise.weight > 0 ? `${exercise.weight}kg` : "자체"}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🏋️</Text>
            <Text style={styles.emptyTitle}>아직 루틴이 없어요</Text>
            <Text style={styles.emptyText}>나만의 운동 루틴을 만들어봐요</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 플로팅 추가 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push("/workout-add")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
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
    headerSub: { fontSize: 14, color: Colors.subText },
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
      backgroundColor: Colors.secondary,
      borderRadius: 4,
      transitionDuration: "width 0.3s",
    },
    progressText: {
      fontSize: 13,
      fontWeight: "700",
      color: Colors.secondary,
      width: 36,
      textAlign: "right",
    },

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
    iconWrap: {
      width: 46,
      height: 46,
      borderRadius: 12,
      backgroundColor: isDark ? "#2C2C2C" : "#F0F0F0",
      justifyContent: "center",
      alignItems: "center",
    },
    iconWrapDone: { backgroundColor: "#FF658422" },
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
      backgroundColor: Colors.secondary,
      borderColor: Colors.secondary,
    },
    checkmark: { color: "#fff", fontSize: 14, fontWeight: "700" },
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

    // 빈 화면
    emptyWrap: { alignItems: "center", paddingVertical: 80 },
    emptyIcon: { fontSize: 56, marginBottom: 16 },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: Colors.text,
      marginBottom: 8,
    },
    emptyText: { fontSize: 14, color: Colors.subText },

    // 플로팅 버튼
    fab: {
      position: "absolute",
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: Colors.secondary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: Colors.secondary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 8,
    },
    fabText: {
      color: "#fff",
      fontSize: 28,
      fontWeight: "300",
      lineHeight: 32,
    },
  });
