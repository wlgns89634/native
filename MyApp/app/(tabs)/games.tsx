import * as RiotApi from "@/lib/riot"; // 경로 확인 필요 (@ 또는 ../../)
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GameHistory = () => {
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

      console.log("-----------------------------------------");
      console.log("🚀 [전적 로딩 시작]");

      // 1. Account-V1 (PUUID 조회)
      console.log("🔍 [Step 1] Account-V1 요청 시도...");
      const account = await RiotApi.getPuuid();
      console.log("✅ [Step 1 성공] PUUID:", account.puuid);

      // 2. Summoner-V4 (소환사 정보 조회)
      console.log("🔍 [Step 2] Summoner-V4 (KR) 요청 시도...");
      const summoner = await RiotApi.getSummoner(account.puuid);
      console.log("✅ [Step 2 성공] Summoner ID:", summoner.puuid);

      // 3. League-V4 (티어 정보) & Match-V5 (매치 리스트)
      console.log("🔍 [Step 3] 티어 및 매치 목록 병렬 요청 중...");
      const [matchIds] = await Promise.all([RiotApi.getMatches(account.puuid)]);
      console.log("✅ [Step 3 성공] 데이터 수신 완료");

      setUserData({
        account,
        summoner,

        matches: [], // 상세 정보는 나중에
      });
    } catch (err: any) {
      console.log("❌ [에러 발생 보고서]");

      if (err.response) {
        // 서버 응답이 온 경우 (403 등)
        console.log("▶ 상태 코드(Status):", err.response.status);
        console.log("▶ 에러 주소(URL):", err.response.config.url);
        console.log(
          "▶ 사용된 헤더(Headers):",
          JSON.stringify(err.response.config.headers, null, 2),
        );
        console.log("▶ 서버 메시지(Data):", JSON.stringify(err.response.data));
      } else {
        // 아예 요청 자체가 안 나간 경우 (네트워크, 오타 등)
        console.log("▶ 일반 에러 메시지:", err.message);
      }
      setError("데이터를 가져오는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
      console.log("-----------------------------------------");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00BFFF" />
      </View>
    );
  }

  if (error || !userData) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={{ color: "#777", marginTop: 10 }} onPress={initLoad}>
          다시 시도하기
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 프로필 카드 */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: `https://ddragon.leagueoflegends.com/cdn/14.6.1/img/profileicon/${userData.summoner.profileIconId}.png`,
          }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>
            {userData.account.gameName} #{userData.account.tagLine}
          </Text>
          <Text style={styles.tier}>
            {userData.rank
              ? `${userData.rank.tier} ${userData.rank.rank}`
              : "Unranked"}
          </Text>
          <Text style={styles.level}>
            Level {userData.summoner.summonerLevel}
          </Text>
        </View>
      </View>

      <Text style={styles.subTitle}>최근 5경기</Text>

      {/* 전적 리스트 */}
      <FlatList
        data={userData.matches}
        keyExtractor={(item) => item.metadata.matchId}
        renderItem={({ item }) => (
          <View style={styles.matchCard}>
            <Text style={styles.matchMode}>{item.info.gameMode}</Text>
            <Text style={styles.matchStatus}>
              {item.info.participants.find(
                (p: any) => p.puuid === userData.account.puuid,
              )?.win
                ? "승리"
                : "패배"}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1215" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f1215",
  },
  profileCard: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#1c2127",
    margin: 15,
    borderRadius: 12,
  },
  avatar: { width: 70, height: 70, borderRadius: 15 },
  profileInfo: { marginLeft: 15, justifyContent: "center" },
  name: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  tier: { color: "#00BFFF", fontSize: 16, fontWeight: "600" },
  level: { color: "#777", fontSize: 13 },
  subTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 10,
  },
  matchCard: {
    backgroundColor: "#1c2127",
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  matchMode: { color: "#fff", fontWeight: "bold" },
  matchStatus: { color: "#ccc" },
  errorText: { color: "#ff4d4d", fontSize: 16 },
});

export default GameHistory;
