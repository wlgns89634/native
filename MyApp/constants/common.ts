export const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

export const COUNTRY_NAMES: Record<string, string> = {
  KR: "대한민국",
  US: "미국",
  JP: "일본",
};

export const CITY_NAMES_KR: Record<string, string> = {
  // 특별시/광역시
  Seoul: "서울",
  Busan: "부산",
  Incheon: "인천",
  Daegu: "대구",
  Daejeon: "대전",
  Gwangju: "광주",
  Ulsan: "울산",
  Sejong: "세종",

  // 경기도
  Suwon: "수원",
  Seongnam: "성남",
  Goyang: "고양",
  Yongin: "용인",
  Bucheon: "부천",
  Ansan: "안산",
  Anyang: "안양",
  Hwaseong: "화성",
  Namyangju: "남양주",
  Uijeongbu: "의정부",
  Paju: "파주",
  Siheung: "시흥",
  Gimpo: "김포",
  Gwangmyeong: "광명",
  Pyeongtaek: "평택",
  Hanam: "하남",
  Osan: "오산",
  Icheon: "이천",
  Gunpo: "군포",
  Uiwang: "의왕",
  Yangju: "양주",
  Guri: "구리",
  Pocheon: "포천",
  Dongducheon: "동두천",
  Gwacheon: "과천",
  Yeoju: "여주",
  Yangpyeong: "양평",
  Gapyeong: "가평",
  Yeoncheon: "연천",
  Anseong: "안성",

  // 강원도
  Chuncheon: "춘천",
  Wonju: "원주",
  Gangneung: "강릉",
  Donghae: "동해",
  Taebaek: "태백",
  Sokcho: "속초",
  Samcheok: "삼척",
  Hongcheon: "홍천",
  Hoengseong: "횡성",
  Yeongwol: "영월",
  Pyeongchang: "평창",
  Jeongseon: "정선",
  Cheorwon: "철원",
  Hwacheon: "화천",
  Yanggu: "양구",
  Inje: "인제",
  Goseong: "고성",
  Yangyang: "양양",

  // 충청북도
  Cheongju: "청주",
  Chungju: "충주",
  Jecheon: "제천",
  Boeun: "보은",
  Okcheon: "옥천",
  Yeongdong: "영동",
  Jeungpyeong: "증평",
  Jincheon: "진천",
  Goesan: "괴산",
  Eumseong: "음성",
  Danyang: "단양",

  // 충청남도
  Cheonan: "천안",
  Gongju: "공주",
  Boryeong: "보령",
  Asan: "아산",
  Seosan: "서산",
  Nonsan: "논산",
  Gyeryong: "계룡",
  Dangjin: "당진",
  Geumsan: "금산",
  Buyeo: "부여",
  Seocheon: "서천",
  Cheongyang: "청양",
  Hongseong: "홍성",
  Yesan: "예산",
  Taean: "태안",

  // 전라북도
  Jeonju: "전주",
  Gunsan: "군산",
  Iksan: "익산",
  Jeongeup: "정읍",
  Namwon: "남원",
  Gimje: "김제",
  Wanju: "완주",
  Jinan: "진안",
  Muju: "무주",
  Jangsu: "장수",
  Imsil: "임실",
  Sunchang: "순창",
  Gochang: "고창",
  Buan: "부안",

  // 전라남도
  Mokpo: "목포",
  Yeosu: "여수",
  Suncheon: "순천",
  Naju: "나주",
  Gwangyang: "광양",
  Damyang: "담양",
  Gokseong: "곡성",
  Gurye: "구례",
  Goheung: "고흥",
  Boseong: "보성",
  Hwasun: "화순",
  Jangheung: "장흥",
  Gangjin: "강진",
  Haenam: "해남",
  Yeongam: "영암",
  Muan: "무안",
  Hampyeong: "함평",
  Yeonggwang: "영광",
  Jangseong: "장성",
  Wando: "완도",
  Jindo: "진도",
  Sinan: "신안",

  // 경상북도
  Pohang: "포항",
  Gyeongju: "경주",
  Gumi: "구미",
  Andong: "안동",
  Gimcheon: "김천",
  Sangju: "상주",
  Mungyeong: "문경",
  Gyeongsan: "경산",
  Uiseong: "의성",
  Cheongsong: "청송",
  Yeongyang: "영양",
  Yeongdeok: "영덕",
  Cheongdo: "청도",
  Goryeong: "고령",
  Seongju: "성주",
  Chilgok: "칠곡",
  Yecheon: "예천",
  Bonghwa: "봉화",
  Uljin: "울진",
  Ulleung: "울릉",

  // 경상남도
  Changwon: "창원",
  Jinju: "진주",
  Tongyeong: "통영",
  Sacheon: "사천",
  Gimhae: "김해",
  Miryang: "밀양",
  Geoje: "거제",
  Yangsan: "양산",
  Uiryeong: "의령",
  Haman: "함안",
  Changnyeong: "창녕",
  Namhae: "남해",
  Hadong: "하동",
  Sancheong: "산청",
  Hamyang: "함양",
  Geochang: "거창",
  Hapcheon: "합천",

  // 제주
  Jeju: "제주",
  Seogwipo: "서귀포",
};

export const COLORS = {
  primary: "#6C63FF", // 메인 보라색
  secondary: "#FF6584", // 포인트 핑크
  background: "#0F0F0F", // 다크 배경
  card: "#1E1E1E", // 카드 배경
  text: "#FFFFFF", // 텍스트
  subText: "#888888", // 서브 텍스트
  success: "#4CAF50", // 완료 초록
  border: "#2C2C2C", // 테두리
};

export const DARK_COLORS = {
  primary: "#6C63FF",
  secondary: "#FF6584",
  background: "#0F0F0F",
  card: "#1E1E1E",
  text: "#FFFFFF",
  subText: "#888888",
  success: "#4CAF50",
  border: "#2C2C2C",
};

export const LIGHT_COLORS = {
  primary: "#6C63FF",
  secondary: "#FF6584",
  background: "#FFFFFF",
  card: "#F5F5F5",
  text: "#000000",
  subText: "#666666",
  success: "#4CAF50",
  border: "#E0E0E0",
};

export const MOTIVATIONS = [
  {
    condition: (p: number, t: number) => t === 0,
    msg: "오늘 루틴을 등록해보세요!",
    emoji: "📝",
  },
  {
    condition: (p: number) => p === 100,
    msg: "완벽해요! 오늘 모두 완료했어요",
    emoji: "🎉",
  },
  {
    condition: (p: number) => p >= 75,
    msg: "거의 다 왔어요! 조금만 더!",
    emoji: "💪",
  },
  {
    condition: (p: number) => p >= 50,
    msg: "절반 넘었어요! 잘하고 있어요",
    emoji: "🔥",
  },
  {
    condition: (p: number) => p >= 25,
    msg: "좋은 시작이에요! 계속 해봐요",
    emoji: "😊",
  },
  { condition: () => true, msg: "오늘 루틴 시작해볼까요?", emoji: "🌅" },
];

export const getMotivation = (percentage: number, totalCount: number) => {
  return (
    MOTIVATIONS.find((m) => m.condition(percentage, totalCount)) ??
    MOTIVATIONS[MOTIVATIONS.length - 1]
  );
};

export const WEATHER_WARNINGS = [
  {
    min: 200,
    max: 300,
    msg: "⛈ 천둥번개가 치고 있어요! 오늘 실외 운동은 무리예요",
  },
  { min: 300, max: 400, msg: "🌦 이슬비가 내려요. 실내 운동을 추천해요" },
  { min: 500, max: 600, msg: "🌧 비가 오고 있어요. 운동하기 힘들겠는데요?" },
  { min: 600, max: 700, msg: "❄️ 눈이 오고 있어요. 운동하기 힘들겠는데요?" },
  { min: 700, max: 800, msg: "🌫 미세먼지/안개가 심해요. 마스크 챙기세요!" },
  { min: 801, max: 805, msg: "☁️ 흐린 날씨예요. 야외 운동 시 주의하세요" },
];

export const getWeatherWarning = (weatherId: number | undefined) => {
  if (!weatherId) return null;
  return (
    WEATHER_WARNINGS.find((w) => weatherId >= w.min && weatherId < w.max)
      ?.msg ?? null
  );
};
