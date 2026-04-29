import "@/config/calendarLocale";
import {
  CITY_NAMES_KR,
  COUNTRY_NAMES,
  DAY_NAMES,
  getMotivation,
  getWeatherLottie,
  getWeatherWarning,
} from "@/constants/common";
import { useColors } from "@/hooks/useColors";
import * as RiotApi from "@/lib/riot";
import { Todo, useAllStore } from "@/store/useAllStore";
import { useThemeStore } from "@/store/useThemeStore";
import { CommonStyles } from "@/styles/common.style";
import { makeStyles } from "@/styles/main.style";

import JugglerLoader from "@/components/common/JugglerLoader";
import axios from "axios";
import * as Location from "expo-location";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

const today = new Date();
const todayStr = today.toISOString().split("T")[0];
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.5;
const CLOSE_THRESHOLD = 80;

export default function Main() {
  const Colors = useColors();
  const { isDark } = useThemeStore();
  const styles = makeStyles(Colors, isDark);
  const cmStyles = CommonStyles(Colors, isDark);

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const sheetBaseY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const translateY = Animated.add(sheetBaseY, dragY);

  const {
    todos,
    fetchTodos,
    isLoading,
    deleteTodo,
    habits,
    fetchHabits,
    workouts,
    fetchWorkouts,
  } = useAllStore();

  const streakCount = 0;
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const todoItems = todos || [];
  const isToday = selectedDate === todayStr;

  const todoTotal = todoItems.length;
  const todoDone = todoItems.filter((i) => (i as any).isCompleted).length;
  const habitTotal = isToday ? habits.length : 0;
  const habitDone = isToday ? habits.filter((h) => h.isCompleted).length : 0;
  const workoutTotal = isToday ? workouts.length : 0;
  const workoutDone = isToday
    ? workouts.filter((w) => w.isCompleted).length
    : 0;

  const totalCount = todoTotal + habitTotal + workoutTotal;
  const completedCount = todoDone + habitDone + workoutDone;
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const weatherId = userData?.weather?.weather?.[0]?.id;
  const weatherWarning = getWeatherWarning(weatherId);
  const weatherLottie = getWeatherLottie(weatherId);

  const motivation = getMotivation(percentage, totalCount);
  const cityName =
    userData?.weather?.sys?.country === "KR"
      ? (CITY_NAMES_KR[userData.weather.name] ?? userData.weather.name)
      : (userData?.weather?.name ?? "");

  const markedDates: Record<string, any> = {};
  allTodos.forEach((todo) => {
    if (!markedDates[todo.date]) {
      markedDates[todo.date] = { marked: true, dotColor: Colors.primary };
    }
  });
  markedDates[selectedDate] = {
    ...(markedDates[selectedDate] || {}),
    selected: true,
    selectedColor: Colors.primary,
  };

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: percentage,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  useEffect(() => {
    fetchTodos(selectedDate);
    if (isToday) {
      fetchHabits();
      fetchWorkouts();
    }
  }, [selectedDate]);

  const fetchMonthTodos = async (year: number, month: number) => {
    const { supabase } = await import("@/lib/supabase");
    const from = `${year}-${String(month).padStart(2, "0")}-01`;
    const to = `${year}-${String(month).padStart(2, "0")}-31`;
    const { data } = await supabase
      .from("todos")
      .select("id, date, title, time, createdAt")
      .gte("date", from)
      .lte("date", to);
    setAllTodos((data as Todo[]) || []);
  };

  useEffect(() => {
    const now = new Date();
    fetchMonthTodos(now.getFullYear(), now.getMonth() + 1);
    initLoad();
  }, []);

  const openSheet = () => {
    dragY.setValue(0);
    setSheetOpen(true);
    Animated.spring(sheetBaseY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 12,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(sheetBaseY, {
      toValue: SHEET_HEIGHT,
      duration: 280,
      useNativeDriver: true,
    }).start(() => {
      dragY.setValue(0);
      setSheetOpen(false);
    });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: dragY } }],
    { useNativeDriver: true },
  );

  const onHandlerStateChange = ({
    nativeEvent,
  }: PanGestureHandlerGestureEvent) => {
    if (nativeEvent.state === State.END) {
      if (
        (nativeEvent as any).translationY > CLOSE_THRESHOLD ||
        (nativeEvent as any).velocityY > 800
      ) {
        closeSheet();
      } else {
        Animated.spring(dragY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }).start();
      }
    }
  };

  const handleDayPress = (dateString: string) => {
    setSelectedDate(dateString);
    fetchTodos(dateString);
    openSheet();
  };

  const handleDelete = (id: string) => {
    Alert.alert("삭제", "이 일정을 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await deleteTodo(id);
          fetchTodos(selectedDate);
        },
      },
    ]);
  };

  const initLoad = async () => {
    try {
      setLoading(true);
      setError(null);

      const WEATHER_KEY = process.env.EXPO_PUBLIC_WEATHER_KEY;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") throw new Error("위치 권한이 거부되었습니다.");

      const position = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = position.coords;

      const [weatherResponse, account] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_KEY}&units=metric&lang=kr`,
        ),
        RiotApi.getPuuid(),
      ]);

      if (!account?.puuid) throw new Error("PUUID를 가져오지 못했습니다.");

      // ✅ summoner + matchIds 병렬 조회
      const [summoner, matchIds] = await Promise.all([
        RiotApi.getSummoner(account.puuid),
        RiotApi.getMatches(account.puuid),
      ]);

      // ✅ 랭크는 puuid로 직접 조회
      const soloRankData = await RiotApi.getRankByPuuid(account.puuid);
      const soloRank =
        soloRankData?.find((r: any) => r.queueType === "RANKED_SOLO_5x5") ??
        null;

      // ✅ 매치 상세 병렬 조회
      const matchDetails = await Promise.all(
        matchIds.slice(0, 5).map((id: string) => RiotApi.getMatchDetail(id)),
      );

      setUserData({
        account,
        summoner: summoner.profileIconId,
        summonerLevel: summoner.summonerLevel,
        rank: soloRank,
        matches: matchDetails,
        weather: weatherResponse.data,
      });
    } catch (e) {
      console.error("=== ❌ 에러 발생 ===", e);
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const renderSheetRightActions = (item: Todo) => (
    <View style={cmStyles.rightActionWrap}>
      <TouchableOpacity
        style={cmStyles.editAction}
        onPress={() => {
          closeSheet();
          router.push({
            pathname: "/todo-add",
            params: { id: item.id, date: item.date },
          });
        }}
      >
        <Text style={cmStyles.editText}>수정</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={cmStyles.deleteAction}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={cmStyles.deleteText}>삭제</Text>
      </TouchableOpacity>
    </View>
  );

  const formatDisplayDate = (d: string) => {
    const [, m, day] = d.split("-");
    const dateObj = new Date(d);
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    return `${parseInt(m)}월 ${parseInt(day)}일 ${dayNames[dateObj.getDay()]}요일`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.dateText}>로딩중~ 긔몰이이잉 화면 바꿀예정~</Text>
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

  // ✅ ScrollView 안의 모든 내용을 ListHeaderComponent로 분리
  const ListHeader = () => (
    <View style={{ padding: 20 }}>
      {/* 날씨 헤더 */}
      <View style={styles.weatherBox}>
        <View style={styles.today_text}>
          <Text style={styles.weatherBoxText}>
            {today.getFullYear()}년 {today.getMonth() + 1}월 {today.getDate()}일{" "}
            {DAY_NAMES[today.getDay()]}요일
          </Text>
        </View>
        <View style={styles.today_weather}>
          {weatherLottie && Platform.OS !== "web" ? (
            <LottieView
              source={weatherLottie}
              autoPlay
              loop
              resizeMode="cover"
              style={{ width: 80, height: 80 }}
            />
          ) : (
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${userData.weather.weather[0].icon}@2x.png`,
              }}
              style={{ width: 50, height: 50 }}
            />
          )}
          <View>
            <Text style={styles.weatherBoxText}>
              {cityName},{" "}
              {COUNTRY_NAMES[userData.weather.sys.country] ??
                userData.weather.sys.country}
            </Text>
            <Text style={styles.weatherBoxText}>
              {userData.weather?.weather[0]?.description}
            </Text>
            <Text style={styles.weatherBoxText}>
              {Math.round(userData.weather?.main?.temp)}°C
            </Text>
          </View>
        </View>
        {weatherWarning && (
          <Text style={styles.weatherBoxText}>{weatherWarning}</Text>
        )}
      </View>

      {/* 달력 */}
      <View style={styles.calendarWrap}>
        <Calendar
          current={todayStr}
          onDayPress={(day: { dateString: string }) =>
            handleDayPress(day.dateString)
          }
          onMonthChange={(month: { year: number; month: number }) =>
            fetchMonthTodos(month.year, month.month)
          }
          monthFormat={"yyyy년 MM월"}
          renderArrow={(direction: string) => (
            <Text style={{ color: Colors.primary, fontSize: 18 }}>
              {direction === "left" ? "‹" : "›"}
            </Text>
          )}
          markedDates={markedDates}
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
          <Text style={styles.greetingText}>오늘도 루틴 지켜봐요 💪</Text>
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
              {isToday && habitTotal > 0 && (
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>✨</Text>
                  <Text style={styles.statText}>
                    습관 {habitDone}/{habitTotal}
                  </Text>
                </View>
              )}
              {isToday && workoutTotal > 0 && (
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>💪</Text>
                  <Text style={styles.statText}>
                    운동 {workoutDone}/{workoutTotal}
                  </Text>
                </View>
              )}
              {todoTotal > 0 && (
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>📅</Text>
                  <Text style={styles.statText}>
                    일정 {todoDone}/{todoTotal}
                  </Text>
                </View>
              )}
            </View>
          </View>
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
          <View style={styles.motivationWrap}>
            <Text style={styles.motivationEmoji}>{motivation.emoji}</Text>
            <Text style={styles.motivationText}>{motivation.msg}</Text>
          </View>
          <Text style={styles.progressSub}>
            {completedCount} / {totalCount} 완료
          </Text>
        </View>
      )}

      {/* 롤 프로필 */}
      <View style={{ height: 20 }} />
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
          <Text style={styles.level}>Lv. {userData.summonerLevel}</Text>
        </View>
      </View>

      <Text style={styles.subTitle}>최근 {userData.matches.length}경기</Text>

      {userData.matches.length === 0 && (
        <Text style={{ color: "#777", textAlign: "center", marginTop: 20 }}>
          최근 경기 기록이 없습니다.
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading && <JugglerLoader />}

      <FlatList
        data={userData.matches}
        keyExtractor={(item) => item.metadata.matchId}
        ListHeaderComponent={<ListHeader />}
        ListFooterComponent={<View style={{ height: 40 }} />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const me = item.info.participants.find(
            (p: any) => p.puuid === userData.account.puuid,
          );
          const win = me?.win;
          return (
            <View style={{ paddingHorizontal: 20 }}>
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
                  <Text style={styles.matchStatus}>
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
                  <Text style={styles.matchStatus}>
                    {me ? `${me.kills}/${me.deaths}/${me.assists}` : ""}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* 딤 오버레이 */}
      {sheetOpen && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.35)",
          }}
          activeOpacity={1}
          onPress={closeSheet}
        />
      )}

      {/* 드래그 가능한 바텀시트 */}
      {sheetOpen && (
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          activeOffsetY={[-5, 5]}
        >
          <Animated.View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: SHEET_HEIGHT,
              backgroundColor: Colors.background,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.12,
              shadowRadius: 10,
              elevation: 20,
              transform: [{ translateY }],
            }}
          >
            {/* 핸들 바 */}
            <View
              style={{ alignItems: "center", paddingTop: 12, paddingBottom: 4 }}
            >
              <View
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: Colors.border,
                }}
              />
            </View>

            {/* 시트 헤더 */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: Colors.border,
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "700", color: Colors.text }}
              >
                {formatDisplayDate(selectedDate)}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.primary,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
                onPress={() => {
                  closeSheet();
                  router.push({
                    pathname: "/todo-add",
                    params: { date: selectedDate },
                  });
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}
                >
                  + 추가
                </Text>
              </TouchableOpacity>
            </View>

            {/* 일정 목록 */}
            <ScrollView
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
            >
              {todoItems.length > 0 ? (
                todoItems.map((item: Todo) => (
                  <Swipeable
                    key={item.id}
                    renderRightActions={() => renderSheetRightActions(item)}
                    friction={2}
                    enableTrackpadTwoFingerGesture
                    rightThreshold={40}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: Colors.card,
                        borderRadius: 12,
                        padding: 14,
                        marginBottom: 8,
                        borderWidth: 1,
                        borderColor: Colors.border,
                        opacity: (item as any).isCompleted ? 0.55 : 1,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "600",
                            color: Colors.text,
                            textDecorationLine: (item as any).isCompleted
                              ? "line-through"
                              : "none",
                            marginBottom: item.time ? 3 : 0,
                          }}
                        >
                          {(item as any).icon ?? "📅"} {item.title}
                        </Text>
                        {item.time ? (
                          <Text style={{ fontSize: 12, color: Colors.subText }}>
                            🕐 {item.time}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </Swipeable>
                ))
              ) : (
                <View style={{ alignItems: "center", paddingTop: 30 }}>
                  <Text style={{ fontSize: 36, marginBottom: 10 }}>📭</Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.subText,
                      marginBottom: 16,
                    }}
                  >
                    이 날은 일정이 없어요
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.primary,
                      borderRadius: 10,
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                    }}
                    onPress={() => {
                      closeSheet();
                      router.push({
                        pathname: "/todo-add",
                        params: { date: selectedDate },
                      });
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "700" }}>
                      + 일정 추가
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              <View style={{ height: 20 }} />
            </ScrollView>
          </Animated.View>
        </PanGestureHandler>
      )}
    </View>
  );
}
