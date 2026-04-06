import { useColors } from "@/hooks/useColors";
import { useThemeStore } from "@/store/useThemeStore";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width - 40;

// 더미 데이터
const weeklyData = {
  labels: ["월", "화", "수", "목", "금", "토", "일"],
  datasets: [{ data: [80, 100, 60, 40, 90, 70, 50] }],
};

const habitStats = [
  { name: "물 2L 마시기", icon: "💧", percentage: 90, streak: 7 },
  { name: "독서 30분", icon: "📚", percentage: 75, streak: 3 },
  { name: "스트레칭", icon: "🧘", percentage: 85, streak: 12 },
  { name: "일기 쓰기", icon: "✏️", percentage: 40, streak: 0 },
];

// 이번달 히트맵 데이터 (1~31일)
const heatmapData = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  level: Math.floor(Math.random() * 4), // 0~3 (0: 없음, 3: 최고)
}));

export default function StatsScreen() {
  const Colors = useColors();
  const { isDark } = useThemeStore();
  const styles = makeStyles(Colors, isDark);

  const heatmapColors = [
    isDark ? "#2C2C2C" : "#E0E0E0",
    "#6C63FF44",
    "#6C63FF88",
    "#6C63FF",
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>통계</Text>
        <Text style={styles.headerSub}>이번달 루틴 현황</Text>
      </View>

      {/* 요약 카드 3개 */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryEmoji}>🎯</Text>
          <Text style={styles.summaryValue}>78%</Text>
          <Text style={styles.summaryLabel}>이번달{"\n"}달성률</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryEmoji}>🔥</Text>
          <Text style={styles.summaryValue}>12일</Text>
          <Text style={styles.summaryLabel}>최고{"\n"}스트릭</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryEmoji}>✅</Text>
          <Text style={styles.summaryValue}>84개</Text>
          <Text style={styles.summaryLabel}>이번달{"\n"}완료</Text>
        </View>
      </View>

      {/* 주간 달성률 차트 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>이번주 달성률</Text>
      </View>
      <View style={styles.chartCard}>
        <BarChart
          data={weeklyData}
          width={screenWidth - 16}
          height={180}
          yAxisLabel=""
          yLabelsOffset={28}
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: Colors.card,
            backgroundGradientFrom: Colors.card,
            backgroundGradientTo: Colors.card,
            decimalPlaces: 0,
            color: () => Colors.primary,
            labelColor: () => Colors.subText,
            style: { borderRadius: 12 },
            barPercentage: 0.6,
            propsForBackgroundLines: {
              strokeDasharray: "",
              stroke: Colors.border,
              strokeWidth: 1,
            },
          }}
          style={{ borderRadius: 12 }}
          showValuesOnTopOfBars
          fromZero
        />
      </View>

      {/* 이번달 히트맵 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>이번달 기록</Text>
      </View>
      <View style={styles.heatmapCard}>
        <View style={styles.heatmapGrid}>
          {heatmapData.map((item) => (
            <View key={item.day} style={styles.heatmapItem}>
              <View
                style={[
                  styles.heatmapDot,
                  { backgroundColor: heatmapColors[item.level] },
                ]}
              />
              <Text style={styles.heatmapDay}>{item.day}</Text>
            </View>
          ))}
        </View>
        {/* 범례 */}
        <View style={styles.legendRow}>
          <Text style={styles.legendLabel}>적음</Text>
          {heatmapColors.map((color, i) => (
            <View
              key={i}
              style={[styles.legendDot, { backgroundColor: color }]}
            />
          ))}
          <Text style={styles.legendLabel}>많음</Text>
        </View>
      </View>

      {/* 습관별 달성률 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>습관별 달성률</Text>
      </View>
      {habitStats.map((habit, index) => (
        <View key={index} style={styles.habitStatCard}>
          <View style={styles.habitStatTop}>
            <View style={styles.habitStatLeft}>
              <Text style={styles.habitStatIcon}>{habit.icon}</Text>
              <Text style={styles.habitStatName}>{habit.name}</Text>
            </View>
            <View style={styles.habitStatRight}>
              {habit.streak > 0 && (
                <Text style={styles.habitStatStreak}>🔥 {habit.streak}일</Text>
              )}
              <Text style={styles.habitStatPercent}>{habit.percentage}%</Text>
            </View>
          </View>
          {/* 달성률 바 */}
          <View style={styles.habitProgressBg}>
            <View
              style={[
                styles.habitProgressFill,
                {
                  width: `${habit.percentage}%`,
                  backgroundColor:
                    habit.percentage >= 80
                      ? Colors.success
                      : habit.percentage >= 50
                        ? Colors.primary
                        : Colors.secondary,
                },
              ]}
            />
          </View>
        </View>
      ))}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const makeStyles = (Colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 20 },

    // 헤더
    header: { marginBottom: 20, marginTop: 8 },
    headerTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: Colors.text,
      marginBottom: 4,
    },
    headerSub: { fontSize: 14, color: Colors.subText },

    // 요약 카드
    summaryRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 24,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: Colors.card,
      borderRadius: 14,
      padding: 14,
      alignItems: "center",
      borderWidth: 1,
      borderColor: Colors.border,
    },
    summaryEmoji: { fontSize: 22, marginBottom: 6 },
    summaryValue: {
      fontSize: 18,
      fontWeight: "800",
      color: Colors.primary,
      marginBottom: 4,
    },
    summaryLabel: {
      fontSize: 11,
      color: Colors.subText,
      textAlign: "center",
      lineHeight: 16,
    },

    // 섹션 헤더
    sectionHeader: { marginBottom: 12 },
    sectionTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: Colors.text,
    },

    // 차트 카드
    chartCard: {
      backgroundColor: Colors.card,
      borderRadius: 16,
      padding: 8,
      marginBottom: 24,
      borderWidth: 2,
      borderColor: Colors.border,
    },

    // 히트맵
    heatmapCard: {
      backgroundColor: Colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    heatmapGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      marginBottom: 12,
    },
    heatmapItem: { alignItems: "center", gap: 2 },
    heatmapDot: {
      width: 28,
      height: 28,
      borderRadius: 6,
    },
    heatmapDay: { fontSize: 9, color: Colors.subText },
    legendRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      justifyContent: "flex-end",
    },
    legendDot: { width: 14, height: 14, borderRadius: 3 },
    legendLabel: { fontSize: 11, color: Colors.subText },

    // 습관별 달성률
    habitStatCard: {
      backgroundColor: Colors.card,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    habitStatTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    habitStatLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    habitStatIcon: { fontSize: 20 },
    habitStatName: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors.text,
    },
    habitStatRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    habitStatStreak: {
      fontSize: 12,
      color: Colors.primary,
      fontWeight: "600",
    },
    habitStatPercent: {
      fontSize: 14,
      fontWeight: "700",
      color: Colors.text,
    },
    habitProgressBg: {
      height: 6,
      backgroundColor: isDark ? "#2C2C2C" : "#E0E0E0",
      borderRadius: 3,
      overflow: "hidden",
    },
    habitProgressFill: {
      height: "100%",
      borderRadius: 3,
    },
  });
