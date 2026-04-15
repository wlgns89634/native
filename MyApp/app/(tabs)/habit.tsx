import SkeletonItem from "@/components/Skeleton/Skeleton";
import { useColors } from "@/hooks/useColors";
import { useAllStore } from "@/store/useAllStore";
import { useThemeStore } from "@/store/useThemeStore";
import { makeStyles } from "@/styles/habit.style";
import { router } from "expo-router";
import { useEffect } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

export default function HabitScreen() {
  const Colors = useColors();
  const { isDark } = useThemeStore();
  const styles = makeStyles(Colors, isDark);

  const { habits, fetchHabits, toggleHabit, deleteHabit, isLoading } =
    useAllStore();

  useEffect(() => {
    fetchHabits();
  }, []);

  const completedCount = habits.filter((h) => h.isCompleted).length;
  const totalCount = habits.length;

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => {
        // 실수 방지를 위한 확인창 (선택사항)
        Alert.alert("삭제", "이 습관을 지우시겠어요?", [
          { text: "취소", style: "cancel" },
          {
            text: "삭제",
            style: "destructive",
            onPress: () => deleteHabit(id),
          },
        ]);
      }}
    >
      <Text style={styles.deleteText}>삭제</Text>
    </TouchableOpacity>
  );

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

        {isLoading ? (
          <SkeletonItem width="100%" height={50} borderRadius={20} />
        ) : (
          <>
            {/* 2. 로딩이 끝났고 데이터가 있을 때: 리스트 표시 */}
            {habits && habits.length > 0 ? (
              habits.map((habit) => (
                <Swipeable
                  key={habit.id}
                  renderRightActions={() => renderRightActions(habit.id)}
                  friction={2}
                  enableTrackpadTwoFingerGesture
                  rightThreshold={40}
                >
                  <TouchableOpacity
                    key={habit.id}
                    style={[
                      styles.habitCard,
                      habit.isCompleted && styles.habitCardDone,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => toggleHabit(habit.id, habit.isCompleted)}
                  >
                    {/* 왼쪽 정보 */}
                    <View style={styles.habitLeft}>
                      <View
                        style={[
                          styles.iconWrap,
                          habit.isCompleted && styles.iconWrapDone,
                        ]}
                      >
                        <Text style={styles.habitIcon}>{habit.icon}</Text>
                      </View>
                      <View>
                        <Text
                          style={[
                            styles.habitName,
                            habit.isCompleted && styles.habitNameDone,
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
                        habit.isCompleted && styles.checkboxDone,
                      ]}
                    >
                      {habit.isCompleted && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </Swipeable>
              ))
            ) : (
              /* 3. 로딩은 끝났는데 데이터가 없을 때: 빈 화면 표시 */
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyIcon}>🌱</Text>
                <Text style={styles.emptyTitle}>아직 습관이 없어요</Text>
                <Text style={styles.emptyText}>
                  좋은 습관을 하나씩 만들어봐요
                </Text>
              </View>
            )}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 플로팅 추가 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => {
          console.log("추가 버튼 클릭");
          router.push("/habit-add");
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
