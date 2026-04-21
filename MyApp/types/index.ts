// 할 일 타입 (습관 + 운동 통합)
export type TodoItem = {
  id: string;
  name: string;
  icon: string;
  type: "habit" | "workout";
  isCompleted: boolean; // 변경
};

// 습관 타입
export type Habit = {
  id: string;
  name: string;
  icon: string;
  time: string;
  isCompleted: boolean; // 변경
  streak: number;
  createdAt: string; // 변경
  completedDate: string; // 변경
};

// 운동 종목 타입
export type Exercise = {
  id: string;
  workout_id?: string; // 추가
  name: string;
  sets: number;
  reps: number;
  weight: number;
};

// 운동 루틴 타입
export type Workout = {
  id: string;
  name: string;
  icon: string;
  year?: number | string;
  week?: number | string;
  day: number | string;
  isCompleted: boolean; // 변경
  createdAt?: string; // 변경
};

// 날씨데이터
export interface IWeatherDTO {
  name: string; // 지역 이름 (예: 파주, Seoul)
  main: {
    temp: number; // 현재 온도
    feels_like: number; // 체감 온도
    humidity: number; // 습도
    temp_min: number; // 최저 기온
    temp_max: number; // 최고 기온
  };
  weather: {
    main: string; // 날씨 상태 (Clouds, Rain 등)
    description: string; // 상세 설명 (구름 조금 등)
    icon: string; // 날씨 아이콘 코드 (01d 등)
  }[];
  wind: {
    speed: number; // 풍속
  };
  dt: number; // 데이터 계산 시간 (Unix timestamp)
}

// 날짜별 할 일 타입
export type TodoData = Record<string, TodoItem[]>;
