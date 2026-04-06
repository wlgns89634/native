// 할 일 타입 (습관 + 운동 통합)
export type TodoItem = {
  id: string;
  name: string;
  icon: string;
  type: "habit" | "workout";
  is_completed: boolean; // 변경
};

// 습관 타입
export type Habit = {
  id: string;
  name: string;
  icon: string;
  time: string;
  is_completed: boolean; // 변경
  streak: number;
  created_at: string; // 변경
  last_completed_date: string; // 변경
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
  exercises: Exercise[];
  is_completed: boolean; // 변경
  created_at?: string; // 변경
};

// 날짜별 할 일 타입
export type TodoData = Record<string, TodoItem[]>;
