import SkeletonItem from "@/components/Skeleton/Skeleton";
import { useColors } from "@/hooks/useColors";
import { useAllStore } from "@/store/useAllStore";
import { useThemeStore } from "@/store/useThemeStore";
import { makeStyles } from "@/styles/common.style";
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
  const styles = makeStyles(Colors, isDark);

  const { workouts, fetchWorkouts, deleteWorkout, isSkeleton } = useAllStore();

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

  const renderRightActions = (id: string) => (
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
  );

  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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
                  {/* 루틴 헤더 */}
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
                          {workout.name}
                          {workout.day}
                        </Text>
                      </View>
                    </View>
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
