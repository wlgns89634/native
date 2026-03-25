// 할 일 타입 (습관 + 운동 통합)
export type TodoItem = {
  id: string;
  name: string;
  icon: string;
  type: "habit" | "workout";
  isCompleted: boolean;
};

// 습관 타입
export type Habit = {
  id: string;
  name: string;
  icon: string;
  time: string; // 알림 시간 "09:00"
  isCompleted: boolean;
  streak: number; // 연속 달성 일수
  createdAt: string; // 생성일 "2026-03-25"
  lastCompletedDate: string; // 마지막 완료일
};

// 운동 종목 타입
export type Exercise = {
  id: string;
  name: string; // 종목명 "벤치프레스"
  sets: number; // 세트 수
  reps: number; // 횟수
  weight: number; // 무게 (kg)
};

// 운동 루틴 타입
export type Workout = {
  id: string;
  name: string; // 루틴명 "가슴 루틴"
  icon: string;
  exercises: Exercise[]; // 운동 종목 목록
  isCompleted: boolean;
  createdAt: string;
};

// 날짜별 할 일 타입
export type TodoData = Record<string, TodoItem[]>;
