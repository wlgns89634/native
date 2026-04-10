import axios from "axios";

// 환경변수 로드
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const GAME_NAME = process.env.EXPO_PUBLIC_GAME_NAME;
const TAG_LINE = process.env.EXPO_PUBLIC_TAG_LINE;

const riotHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
  "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
  Origin: "https://developer.riotgames.com",
  "X-Riot-Token": API_KEY,
};

const asiaApi = axios.create({
  baseURL: "https://asia.api.riotgames.com",
  headers: riotHeaders,
});

const krApi = axios.create({
  baseURL: "https://kr.api.riotgames.com",
  headers: riotHeaders,
});

/** 1. 성공했던 PUUID 조회 (asiaApi) */
export const getPuuid = async () => {
  const encodedName = encodeURIComponent(GAME_NAME!.trim());
  const { data } = await asiaApi.get(
    `/riot/account/v1/accounts/by-riot-id/${encodedName}/${TAG_LINE}`,
  );
  return data;
};

/** 2. 여기서 403 발생 중 (krApi) */
export const getSummoner = async (puuid: string) => {
  const response = await krApi.get(
    `/lol/summoner/v4/summoners/by-puuid/${puuid}`,
  );

  // 여기서 response.data 안에 우리가 그토록 찾던 'id'가 들어있습니다.
  console.log("드디어 찾은 소환사 ID(열쇠):", response.data);

  return response.data;
};
/** 3. 티어 조회 (krApi) */
export const getRank = async (summonerId: string) => {
  const { data } = await krApi.get(
    `/lol/league/v4/entries/by-summoner/${summonerId}`,
    {
      headers: riotHeaders,
    },
  );
  return data;
};

/** 4. 최근 매치 ID 리스트 조회 */
export const getMatches = async (puuid: string) => {
  const { data } = await asiaApi.get(
    `/lol/match/v5/matches/by-puuid/${puuid}/ids`,
    { params: { start: 0, count: 5 } },
  );
  return data;
};

/** 5. 매치 상세 정보 조회 */
export const getMatchDetail = async (matchId: string) => {
  const { data } = await asiaApi.get(`/lol/match/v5/matches/${matchId}`);
  return data;
};
