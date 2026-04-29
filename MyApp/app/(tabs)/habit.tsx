import SkeletonItem from "@/components/Skeleton/Skeleton";
import JugglerLoader from "@/components/common/JugglerLoader";

import { useColors } from "@/hooks/useColors";
import { useAllStore } from "@/store/useAllStore";
import { useThemeStore } from "@/store/useThemeStore";
import { CommonStyles } from "@/styles/common.style";
import { router } from "expo-router";
import { useEffect } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

export default function HabitScreen() {
  const Colors = useColors();

  const { isDark } = useThemeStore();
  const styles = CommonStyles(Colors, isDark);

  const { habits, fetchHabits, deleteHabit, isSkeleton, isLoading } =
    useAllStore();

  useEffect(() => {
    fetchHabits();
  }, []);

  const totalCount = habits.length;

  const renderRightActions = (id: string) => (
    <View style={styles.rightActionWrap}>
      <TouchableOpacity
        style={styles.editAction}
        onPress={() => router.push({ pathname: "/habit-add", params: { id } })}
      >
        <Text style={styles.editText}>수정</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => {
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
    </View>
  );

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
            <Text style={styles.headerTitle}>습관</Text>
            <Text style={styles.headerSub}>오늘의 습관을 체크해보세요</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{totalCount}</Text>
          </View>
        </View>

        {isSkeleton ? (
          <SkeletonItem width="100%" height={50} borderRadius={20} />
        ) : (
          <>
            {habits && habits.length > 0 ? (
              habits.map((habit) => (
                <Swipeable
                  key={habit.id}
                  renderRightActions={() => renderRightActions(habit.id)}
                  friction={2}
                  enableTrackpadTwoFingerGesture
                  rightThreshold={40}
                >
                  <View
                    key={habit.id}
                    style={[
                      styles.commonCard,
                      habit.isCompleted && styles.habitCardDone,
                    ]}
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
                  </View>
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
          router.push("/habit-add");
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
