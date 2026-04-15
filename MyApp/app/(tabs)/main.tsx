import "@/config/calendarLocale";
import { useColors } from "@/hooks/useColors";
import * as RiotApi from "@/lib/riot";
import { useThemeStore } from "@/store/useThemeStore";
import { makeStyles } from "@/styles/main.style";
import { TodoData } from "@/types";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initLoad();
  }, []);

  const initLoad = async () => {
    try {
      setLoading(true);
      setError(null);

      const account = await RiotApi.getPuuid();
      console.log("account:", JSON.stringify(account));
      console.log("account.puuid:", account?.puuid);
      console.log("테스트");

      if (!account?.puuid) throw new Error("PUUID를 가져오지 못했습니다.");

      const [rankData] = await Promise.all([RiotApi.getMatches(account.puuid)]);

      const soloRank =
        rankData?.find((r: any) => r.queueType === "RANKED_SOLO_5x5") ?? null;

      let matchDetails: any[] = [];

      setUserData({
        account,
        rank: soloRank,
        matches: matchDetails,
      });
    } catch (err: any) {
      console.log("=== ❌ 에러 발생 ===");
      if (err.response) {
        setError(
          `API 오류 (${err.response.status}): ${err.response.config?.url}`,
        );
      } else {
        setError(err.message ?? "알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00BFFF" />
        <Text style={{ color: "#777", marginTop: 12 }}>
          데이터 불러오는 중...
        </Text>
      </View>
    );
  }

  if (error || !userData) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? "데이터 없음"}</Text>
        <TouchableOpacity onPress={initLoad} style={styles.retryBtn}>
          <Text style={{ color: "#00BFFF" }}>다시 시도하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

      <SafeAreaView style={styles.container}>
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: `https://ddragon.leagueoflegends.com/cdn/14.6.1/img/profileicon/${userData.summoner}.png`,
            }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              {userData.account.gameName} #{userData.account.tagLine}
            </Text>
            <Text style={styles.tier}>
              {userData.rank
                ? `${userData.rank.tier} ${userData.rank.rank} · ${userData.rank.leaguePoints}LP`
                : "Unranked"}
            </Text>
            <Text style={styles.level}>Lv. {userData.summoner}</Text>
          </View>
        </View>

        <Text style={styles.subTitle}>최근 {userData.matches.length}경기</Text>

        {userData.matches.length === 0 ? (
          <Text style={{ color: "#777", textAlign: "center", marginTop: 20 }}>
            최근 경기 기록이 없습니다.
          </Text>
        ) : (
          <FlatList
            data={userData.matches}
            keyExtractor={(item) => item.metadata.matchId}
            renderItem={({ item }) => {
              const me = item.info.participants.find(
                (p: any) => p.puuid === userData.account.puuid,
              );
              const win = me?.win;
              return (
                <View
                  style={[
                    styles.matchCard,
                    {
                      borderLeftColor: win ? "#1a9e5c" : "#c0392b",
                      borderLeftWidth: 4,
                    },
                  ]}
                >
                  <View>
                    <Text style={styles.matchMode}>{item.info.gameMode}</Text>
                    <Text style={{ color: "#aaa", fontSize: 12, marginTop: 3 }}>
                      {me?.championName ?? ""}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={[
                        styles.matchStatus,
                        {
                          color: win ? "#1a9e5c" : "#c0392b",
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {win ? "승리" : "패배"}
                    </Text>
                    <Text style={{ color: "#aaa", fontSize: 12, marginTop: 3 }}>
                      {me ? `${me.kills}/${me.deaths}/${me.assists}` : ""}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}
      </SafeAreaView>
    </ScrollView>
  );
}
