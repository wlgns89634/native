import JugglerLoader from "@/components/common/JugglerLoader";
import SkeletonItem from "@/components/Skeleton/Skeleton";
import WorkoutHistory from "@/components/WorkoutHistory/WorkoutHistory ";
import { useColors } from "@/hooks/useColors";
import { useAllStore } from "@/store/useAllStore";
import { useThemeStore } from "@/store/useThemeStore";
import { CommonStyles } from "@/styles/common.style";
import { Exercise } from "@/types";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";

import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import {
  Alert,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const calcTime = (exercises: Exercise[]) => {
  const totalSets = exercises.reduce((acc, e) => acc + e.sets, 0);
  return totalSets * 2;
};

export default function WorkoutScreen() {
  const Colors = useColors();
  const { isDark } = useThemeStore();
  const styles = CommonStyles(Colors, isDark);

  const {
    workouts,
    fetchWorkouts,
    fetchWeekHistories,
    deleteWorkout,
    isSkeleton,
    toggleWorkout,
    isLoading,
  } = useAllStore();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleComplete = (id: string, isCompleted: boolean) => {
    toggleWorkout(id, isCompleted);
  };

  const completedCount = workouts.filter(
    (w: { isCompleted: boolean }) => w.isCompleted,
  ).length;
  const totalCount = workouts.length;

  const animatedWidth = useRef(new Animated.Value(0)).current;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderRightActions = (id: string) => (
    <View style={styles.rightActionWrap}>
      <TouchableOpacity
        style={styles.editAction}
        onPress={() =>
          router.push({ pathname: "/workout-add", params: { id } })
        } // id만 사용
      >
        <Text style={styles.editText}>수정</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => {
          Alert.alert("삭제", "이 루틴을 지우시겠어요?", [
            { text: "취소", style: "cancel" },
            {
              text: "삭제",
              style: "destructive",
              onPress: () => deleteWorkout(id),
            },
          ]);
        }}
      >
        <Text style={styles.deleteText}>삭제</Text>
      </TouchableOpacity>
    </View>
  );

  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  useEffect(() => {
    fetchWorkouts();
    fetchWeekHistories();
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
      {isLoading && <JugglerLoader />}
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
            {progressPercent > 0 ? `${progressPercent}%` : "0%"}
          </Text>
        </View>

        {isSkeleton ? (
          <SkeletonItem width="100%" height={50} borderRadius={20} />
        ) : (
          <>
            {workouts && workouts.length > 0 ? (
              workouts.map((workout) => (
                <Swipeable
                  key={workout.id}
                  renderRightActions={() => renderRightActions(workout.id)}
                  friction={2}
                  enableTrackpadTwoFingerGesture
                  rightThreshold={40}
                >
                  {/* 루틴 헤더 (카드 전체 클릭 시 열림/닫힘) */}
                  <TouchableOpacity
                    style={styles.commonCard}
                    key={workout.id}
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
                          {workout.name} {workout.day}
                        </Text>
                      </View>
                    </View>

                    {/* 🆕 체크박스 영역 추가 */}
                    <TouchableOpacity
                      style={styles.checkboxWrap}
                      activeOpacity={0.6}
                      onPress={() =>
                        toggleComplete(workout.id, workout.isCompleted)
                      }
                      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} // 터치 영역 여유롭게
                    >
                      <View
                        style={[
                          styles.checkbox,
                          workout.isCompleted && styles.checkboxDone,
                        ]}
                      >
                        {workout.isCompleted && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Swipeable>
              ))
            ) : (
              /* 3. 데이터가 아예 없을 때 */
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyIcon}>🏋️</Text>
                <Text style={styles.emptyTitle}>아직 루틴이 없어요</Text>
                <Text style={styles.emptyText}>
                  나만의 운동 루틴을 만들어봐요
                </Text>
              </View>
            )}
          </>
        )}

        <View style={{ height: 100 }} />
        <WorkoutHistory />
      </ScrollView>

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
