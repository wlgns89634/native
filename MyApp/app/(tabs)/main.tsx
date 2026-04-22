import "@/config/calendarLocale";
import {
  CITY_NAMES_KR,
  COUNTRY_NAMES,
  DAY_NAMES,
  getMotivation,
  getWeatherWarning,
} from "@/constants/common";
import { useColors } from "@/hooks/useColors";
import * as RiotApi from "@/lib/riot";
import { useAllStore } from "@/store/useAllStore";
import { useThemeStore } from "@/store/useThemeStore";
import { makeStyles } from "@/styles/main.style";
import axios from "axios";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";

import {
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

const today = new Date();
const todayStr = today.toISOString().split("T")[0];

export default function Main() {
  const Colors = useColors();
  const { isDark } = useThemeStore();
  const styles = makeStyles(Colors, isDark);

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { todos, fetchTodos, isLoading } = useAllStore();

  const markedDates: Record<string, any> = {};
  const streakCount = 0;

  const animatedWidth = useRef(new Animated.Value(0)).current;

  const selectedItems = todos[selectedDate] || [];
  const completedCount = selectedItems.filter((i) => i.isCompleted).length;
  const totalCount = selectedItems.length;
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const workoutCount = selectedItems.filter((i) => i.type === "workout").length;
  const workoutDone = selectedItems.filter(
    (i) => i.type === "workout" && i.isCompleted,
  ).length;

  const weatherWarning = getWeatherWarning(userData?.weather?.weather?.[0]?.id);
  const motivation = getMotivation(percentage, totalCount);
  const cityName =
    userData?.weather?.sys?.country === "KR"
      ? (CITY_NAMES_KR[userData.weather.name] ?? userData.weather.name)
      : (userData?.weather?.name ?? "");

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: percentage,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  useEffect(() => {
    fetchTodos(selectedDate);
    initLoad();
  }, [selectedDate]);

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

      const [rankData] = await Promise.all([RiotApi.getMatches(account.puuid)]);

      const soloRank =
        rankData?.find((r: any) => r.queueType === "RANKED_SOLO_5x5") ?? null;

      const matchDetails: any = [];

      setUserData({
        account,
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

  // 로딩 중
  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.dateText}>로딩중~ 긔몰이이잉 화면 바꿀예정~</Text>
      </View>
    );
  }

  // 에러 or 데이터 없음
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
          {weatherWarning && (
            <View style={styles.weatherWarning}>
              <Text style={styles.weatherWarningText}>{weatherWarning}</Text>
            </View>
          )}
          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${userData.weather.weather[0].icon}@2x.png`,
            }}
            style={{ width: 50, height: 50 }}
          />
          <Text style={styles.dateText}>
            {cityName},{" "}
            {COUNTRY_NAMES[userData.weather.sys.country] ??
              userData.weather.sys.country}
          </Text>
          <Text style={styles.dateText}>
            {userData.weather?.weather[0]?.description}
          </Text>
          <Text style={styles.dateText}>
            {Math.round(userData.weather?.main?.temp)}°C
          </Text>
          <Text style={styles.dateText}>
            {today.getMonth() + 1}월 {today.getDate()}일{" "}
            {DAY_NAMES[today.getDay()]}요일
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
          <Text style={styles.progressSub}>{workoutDone} 운동 완료</Text>
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
        selectedItems.map((item: any) => (
          <TouchableOpacity
            key={item.id}
            style={styles.todoItem}
            activeOpacity={0.7}
          >
            <View style={styles.todoLeft}>
              <Text style={styles.todoIcon}>{item.icon}</Text>
              <View>
                <Text
                  style={[styles.todoName, item.isCompleted && styles.todoDone]}
                >
                  {item.name}
                </Text>
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
            {/* <View
              style={[styles.checkbox, item.isCompleted && styles.checkboxDone]}
            >
              {item.isCompleted && <Text style={styles.checkmark}>✓</Text>}
            </View> */}
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>이 날은 일정이 없어요</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() =>
              router.push({
                pathname: "/todo-add",
                params: { date: selectedDate },
              })
            }
          >
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
