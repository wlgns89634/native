import { useColors } from "@/hooks/useColors";
import { useAllStore, WeekHistory } from "@/store/useAllStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

const getBadge = (rate: number, isCurrentWeek = false) => {
  if (isCurrentWeek)
    return { label: "진행 중", bg: "#E6F1FB", color: "#0C447C" };
  if (rate === 100)
    return { label: "완벽 달성", bg: "#EAF3DE", color: "#27500A" };
  if (rate >= 70) return { label: "잘했어요", bg: "#E6F1FB", color: "#0C447C" };
  return { label: "조금 아쉬워요", bg: "#F1EFE8", color: "#444441" };
};

const getBarColor = (rate: number) => {
  if (rate === 100) return "#639922";
  if (rate >= 70) return "#378ADD";
  return "#888780";
};

interface CurrentWeekCardProps {
  workouts: any[];
  styles: any;
}

function CurrentWeekCard({ workouts, styles }: CurrentWeekCardProps) {
  const completedCount = workouts.filter((w) => w.isCompleted).length;
  const totalCount = workouts.length;
  const rate =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const badge = getBadge(rate, true);

  // 요일별 완료 여부 (day: 0=일,1=월,...6=토 → 월~일 순으로 재정렬)
  const dayStatus = DAY_LABELS.map((_, i) => {
    const dayIndex = i === 6 ? 0 : i + 1; // 월=1 ~ 일=0
    return workouts.some((w) => w.day === dayIndex && w.isCompleted);
  });

  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.weekTitle}>이번 주</Text>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.color }]}>
            {badge.label}
          </Text>
        </View>
      </View>

      <View style={styles.dotRow}>
        {DAY_LABELS.map((label, i) => (
          <View key={label} style={styles.dotWrap}>
            <View
              style={[
                styles.dot,
                dayStatus[i] ? styles.dotDone : styles.dotMiss,
              ]}
            >
              <Text
                style={[
                  styles.dotText,
                  dayStatus[i] ? styles.dotTextDone : styles.dotTextMiss,
                ]}
              >
                {label}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.barWrap}>
        <View style={styles.barBg}>
          <View
            style={[
              styles.barFill,
              { width: `${rate}%`, backgroundColor: getBarColor(rate) },
            ]}
          />
        </View>
        <View style={styles.barMeta}>
          <Text style={styles.barSub}>
            {completedCount} / {totalCount} 완료
          </Text>
          <Text style={styles.barSub}>{rate}%</Text>
        </View>
      </View>
    </View>
  );
}

interface HistoryCardProps {
  history: WeekHistory;
  styles: any;
}

function HistoryCard({ history, styles }: HistoryCardProps) {
  const badge = getBadge(history.workoutRate);
  const barColor = getBarColor(history.workoutRate);

  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.weekTitle}>{history.label}</Text>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.color }]}>
            {badge.label}
          </Text>
        </View>
      </View>

      <View style={styles.barWrap}>
        <View style={styles.barBg}>
          <View
            style={[
              styles.barFill,
              { width: `${history.workoutRate}%`, backgroundColor: barColor },
            ]}
          />
        </View>
        <View style={styles.barMeta}>
          <Text style={styles.barSub}>
            {history.workoutDone} / {history.workoutTotal} 완료
          </Text>
          <Text style={styles.barSub}>{history.workoutRate}%</Text>
        </View>
      </View>

      <View style={styles.chips}>
        <View style={styles.chip}>
          <Text style={styles.chipVal}>{history.workoutDone}일</Text>
          <Text style={styles.chipLbl}>운동일</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipVal}>
            {history.workoutRate === 100 ? "7일" : "-"}
          </Text>
          <Text style={styles.chipLbl}>연속 달성</Text>
        </View>
      </View>
    </View>
  );
}

export default function WorkoutHistory() {
  const Colors = useColors();
  const { isDark } = useThemeStore();
  const styles = makeHistoryStyles(Colors, isDark);

  const {
    workouts,
    weekHistories,
    fetchWeekHistories,
    fetchMoreHistories,
    hasMoreHistory,
    isHistoryLoading,
  } = useAllStore();

  useEffect(() => {
    fetchWeekHistories();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionLabel}>이번 주 운동</Text>
      <CurrentWeekCard workouts={workouts} styles={styles} />

      <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
        지난 주 히스토리
      </Text>

      {weekHistories.length === 0 && !isHistoryLoading ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>아직 히스토리가 없어요</Text>
        </View>
      ) : (
        weekHistories.map((history) => (
          <HistoryCard
            key={`${history.year}-${history.week}`}
            history={history}
            styles={styles}
          />
        ))
      )}

      {hasMoreHistory && (
        <TouchableOpacity
          style={styles.moreBtn}
          onPress={fetchMoreHistories}
          disabled={isHistoryLoading}
        >
          <Text style={styles.moreBtnText}>
            {isHistoryLoading ? "불러오는 중..." : "더보기"}
          </Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const makeHistoryStyles = (Colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    content: {
      padding: 16,
    },
    sectionLabel: {
      fontSize: 12,
      color: Colors.subText,
      fontWeight: "500",
      marginBottom: 8,
      letterSpacing: 0.3,
    },
    card: {
      backgroundColor: Colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 10,
      borderWidth: 0.5,
      borderColor: Colors.border,
    },
    cardRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    weekTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: Colors.text,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 20,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: "500",
    },
    dotRow: {
      flexDirection: "row",
      gap: 5,
      marginTop: 10,
      marginBottom: 4,
    },
    dotWrap: {
      alignItems: "center",
    },
    dot: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    dotDone: {
      backgroundColor: "#EAF3DE",
    },
    dotMiss: {
      backgroundColor: Colors.background,
      borderWidth: 0.5,
      borderColor: Colors.border,
    },
    dotText: {
      fontSize: 11,
      fontWeight: "500",
    },
    dotTextDone: {
      color: "#27500A",
    },
    dotTextMiss: {
      color: Colors.subText,
    },
    barWrap: {
      marginTop: 10,
    },
    barBg: {
      height: 8,
      backgroundColor: Colors.background,
      borderRadius: 4,
      overflow: "hidden",
    },
    barFill: {
      height: "100%",
      borderRadius: 4,
    },
    barMeta: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 5,
    },
    barSub: {
      fontSize: 12,
      color: Colors.subText,
    },
    chips: {
      flexDirection: "row",
      gap: 8,
      marginTop: 10,
    },
    chip: {
      flex: 1,
      backgroundColor: Colors.background,
      borderRadius: 8,
      padding: 10,
      alignItems: "center",
    },
    chipVal: {
      fontSize: 15,
      fontWeight: "500",
      color: Colors.text,
    },
    chipLbl: {
      fontSize: 11,
      color: Colors.subText,
      marginTop: 2,
    },
    moreBtn: {
      width: "100%",
      padding: 12,
      borderWidth: 0.5,
      borderColor: Colors.border,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 4,
    },
    moreBtnText: {
      fontSize: 13,
      color: Colors.subText,
    },
    emptyWrap: {
      alignItems: "center",
      padding: 32,
    },
    emptyText: {
      fontSize: 14,
      color: Colors.subText,
    },
  });
