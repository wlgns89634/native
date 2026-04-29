import { supabase } from "@/lib/supabase";
import { Habit, Workout } from "@/types";
import { create } from "zustand";

const getDateInfo = () => {
  const now = new Date();
  const year = now.getFullYear();

  const target = new Date(now.valueOf());
  const dayNr = (now.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  const week = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  const day = now.getDay();

  return { year, week, day };
};

const getWeekInfo = (weeksAgo: number) => {
  const now = new Date();
  now.setDate(now.getDate() - weeksAgo * 7);

  const year = now.getFullYear();
  const target = new Date(now.valueOf());
  const dayNr = (now.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  const week = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);

  return { year, week };
};

const getWeekLabel = (year: number, week: number): string => {
  const jan1 = new Date(year, 0, 1);
  const firstMonday = new Date(jan1);
  firstMonday.setDate(jan1.getDate() + ((1 - jan1.getDay() + 7) % 7));
  const weekStart = new Date(firstMonday);
  weekStart.setDate(firstMonday.getDate() + (week - 1) * 7);

  const month = weekStart.getMonth() + 1;
  const weekOfMonth = Math.ceil(weekStart.getDate() / 7);

  return `${month}월 ${weekOfMonth}주차`;
};

export interface WeekHistory {
  year: number;
  week: number;
  label: string;
  workoutTotal: number;
  workoutDone: number;
  workoutRate: number;
}

export interface StatsData {
  weeklyRates: number[];
  monthlyRate: number;
  totalCompleted: number;
  bestStreak: number;
  heatmap: { day: number; level: number }[];
}

export interface Todo {
  id: string;
  title: string;
  date: string;
  time: string;
  createdAt: string;
}

const HISTORY_PAGE_SIZE = 4;

interface AllStore {
  habits: Habit[];
  fetchHabits: () => Promise<void>;
  addHabit: (habit: Omit<Habit, "id" | "createdAt">) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  updateHabit: (
    id: string,
    updates: Partial<Omit<Habit, "id" | "createdAt">>,
  ) => Promise<void>;

  workouts: Workout[];
  fetchWorkouts: () => Promise<void>;
  addWorkout: (workout: Omit<Workout, "id" | "createdAt">) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  updateWorkout: (
    id: string,
    updates: Partial<Omit<Workout, "id" | "createdAt">>,
  ) => Promise<void>;
  toggleWorkout: (id: string, current: boolean) => Promise<void>;

  todos: Todo[];
  fetchTodos: (date: string) => Promise<void>;
  addTodo: (todo: Omit<Todo, "id" | "createdAt">) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  updateTodo: (
    id: string,
    updates: Partial<Omit<Todo, "id" | "createdAt">>,
  ) => Promise<void>;
  isTodoLoading: boolean;

  weekHistories: WeekHistory[];
  fetchWeekHistories: (limit?: number) => Promise<void>;
  fetchMoreHistories: () => Promise<void>;

  statsData: StatsData | null;
  fetchStats: () => Promise<void>;

  isSkeleton: boolean;
  isLoading: boolean;
  isHistoryLoading: boolean;
  hasMoreHistory: boolean;
  historyOffset: number;
}

export const useAllStore = create<AllStore>((set, get) => ({
  habits: [],
  workouts: [],
  weekHistories: [],
  statsData: null,
  isSkeleton: false,
  isLoading: false,
  isHistoryLoading: false,
  hasMoreHistory: true,
  historyOffset: 0,

  // --- [습관(Habit) 관련 로직] ---

  fetchHabits: async () => {
    set({ isSkeleton: true });
    try {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .order("createdAt", { ascending: true });

      if (error) throw error;
      set({ habits: data || [] });
    } catch (error) {
      console.error("습관 페칭 중 오류:", error);
    } finally {
      set({ isSkeleton: false });
    }
  },

  addHabit: async (habit) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("habits")
        .insert([
          {
            name: habit.name,
            icon: habit.icon,
            time: habit.time,
            isCompleted: false,
            streak: 0,
          },
        ])
        .select();

      if (error) throw error;
      if (data) {
        set((state) => ({ habits: [...state.habits, data[0]] }));
      }
    } catch (error) {
      console.error("습관 추가 중 오류:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteHabit: async (id) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.from("habits").delete().eq("id", id);
      if (error) throw error;
      set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }));
    } catch (error) {
      console.error("습관 삭제 중 오류:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateHabit: async (id, updates) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("habits")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      if (data) {
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...data[0] } : h,
          ),
        }));
      }
    } catch (error) {
      console.error("습관 수정 중 오류:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // --- [운동(Workout) 관련 로직] ---

  fetchWorkouts: async () => {
    set({ isSkeleton: true });

    const { year, week } = getDateInfo();
    const targetYear = Number(year);
    const targetWeek = Number(week);

    try {
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("year", targetYear)
        .eq("week", targetWeek)
        .order("day", { ascending: true })
        .order("createdAt", { ascending: true });

      if (error) throw error;

      set({ workouts: data || [] });
    } catch (error) {
      console.error("운동 페칭 중 오류:", error);
      set({ workouts: [] });
    } finally {
      set({ isSkeleton: false });
    }
  },

  addWorkout: async (workout) => {
    set({ isLoading: true });
    const { year: currentYear, week: currentWeek } = getDateInfo();

    try {
      const { data, error } = await supabase
        .from("workouts")
        .insert([
          {
            name: workout.name,
            icon: workout.icon,
            year: currentYear,
            week: currentWeek,
            day: workout.day,
            isCompleted: false,
          },
        ])
        .select();

      if (error || !data) throw error;

      set((state) => ({
        workouts: [...state.workouts, { ...data[0] }],
      }));
    } catch (error) {
      console.error("운동 추가 중 오류:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteWorkout: async (id) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.from("workouts").delete().eq("id", id);
      if (error) throw error;
      set((state) => ({
        workouts: state.workouts.filter((w) => w.id !== id),
      }));
    } catch (error) {
      console.error("운동 삭제 중 오류:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateWorkout: async (id, updates) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("workouts")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      if (data) {
        set((state) => ({
          workouts: state.workouts.map((w) =>
            w.id === id ? { ...w, ...data[0] } : w,
          ),
        }));
      }
    } catch (error) {
      console.error("운동 수정 중 오류:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  toggleWorkout: async (id, current) => {
    try {
      const { error } = await supabase
        .from("workouts")
        .update({ isCompleted: !current })
        .eq("id", id);

      if (error) throw error;
      set((state) => ({
        workouts: state.workouts.map((w) =>
          w.id === id ? { ...w, isCompleted: !current } : w,
        ),
      }));
    } catch (error) {
      console.error("운동 토글 중 오류:", error);
    }
  },

  todos: [],
  isTodoLoading: false,

  fetchTodos: async (date) => {
    set({ isTodoLoading: true });
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("date", date)
        .order("createdAt", { ascending: true });

      if (error) throw error;
      set({ todos: data || [] });
    } catch (error) {
      console.error("일정 페칭 중 오류:", error);
    } finally {
      set({ isTodoLoading: false });
    }
  },

  addTodo: async (todo) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("todos")
        .insert([
          {
            title: todo.title,
            date: todo.date,
            time: todo.time,
          },
        ])
        .select();

      if (error) throw error;
      if (data) {
        set((state) => ({ todos: [...state.todos, data[0]] }));
      }
    } catch (error) {
      console.error("일정 추가 중 오류:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTodo: async (id) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw error;
      set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }));
    } catch (error) {
      console.error("일정 삭제 중 오류:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateTodo: async (id, updates) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("todos")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      if (data) {
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, ...data[0] } : t,
          ),
        }));
      }
    } catch (error) {
      console.error("일정 수정 중 오류:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // --- [히스토리 관련 로직] ---

  fetchWeekHistories: async (limit = HISTORY_PAGE_SIZE) => {
    set({ isHistoryLoading: true });
    try {
      const histories: WeekHistory[] = [];

      const weekInfos = Array.from({ length: limit }, (_, i) => ({
        index: i,
        ...getWeekInfo(i + 1),
      }));

      await Promise.all(
        weekInfos.map(async ({ index, year, week }) => {
          const { data: workouts } = await supabase
            .from("workouts")
            .select("isCompleted")
            .eq("year", year)
            .eq("week", week);

          const workoutTotal = workouts?.length ?? 0;
          const workoutDone =
            workouts?.filter((w) => w.isCompleted).length ?? 0;

          histories[index] = {
            year,
            week,
            label: getWeekLabel(year, week),
            workoutTotal,
            workoutDone,
            workoutRate:
              workoutTotal > 0
                ? Math.round((workoutDone / workoutTotal) * 100)
                : 0,
          };
        }),
      );

      set({
        weekHistories: histories.filter(Boolean),
        historyOffset: limit,
        hasMoreHistory: histories.filter(Boolean).length === limit,
      });
    } catch (error) {
      console.error("히스토리 페칭 중 오류:", error);
    } finally {
      set({ isHistoryLoading: false });
    }
  },

  fetchMoreHistories: async () => {
    const { historyOffset, weekHistories, isHistoryLoading } = get();
    if (isHistoryLoading) return;

    set({ isHistoryLoading: true });
    try {
      const newHistories: WeekHistory[] = [];

      const weekInfos = Array.from({ length: HISTORY_PAGE_SIZE }, (_, i) => ({
        index: i,
        ...getWeekInfo(historyOffset + i + 1),
      }));

      await Promise.all(
        weekInfos.map(async ({ index, year, week }) => {
          const { data: workouts } = await supabase
            .from("workouts")
            .select("isCompleted")
            .eq("year", year)
            .eq("week", week);

          const workoutTotal = workouts?.length ?? 0;
          const workoutDone =
            workouts?.filter((w) => w.isCompleted).length ?? 0;

          newHistories[index] = {
            year,
            week,
            label: getWeekLabel(year, week),
            workoutTotal,
            workoutDone,
            workoutRate:
              workoutTotal > 0
                ? Math.round((workoutDone / workoutTotal) * 100)
                : 0,
          };
        }),
      );

      const filtered = newHistories.filter(Boolean);

      set({
        weekHistories: [...weekHistories, ...filtered],
        historyOffset: historyOffset + HISTORY_PAGE_SIZE,
        hasMoreHistory: filtered.length === HISTORY_PAGE_SIZE,
      });
    } catch (error) {
      console.error("히스토리 추가 페칭 중 오류:", error);
    } finally {
      set({ isHistoryLoading: false });
    }
  },

  // --- [통계 관련 로직] ---

  fetchStats: async () => {
    set({ isSkeleton: true });
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();

      const firstDay = new Date(year, month, 1).toISOString();
      const lastDay = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

      // 이번달 운동 + 습관 병렬 조회
      const [workoutRes, habitRes] = await Promise.all([
        supabase
          .from("workouts")
          .select("isCompleted, day, createdAt")
          .gte("createdAt", firstDay)
          .lte("createdAt", lastDay),
        supabase.from("habits").select("isCompleted, streak"),
      ]);

      const workouts = workoutRes.data || [];
      const habitList = habitRes.data || [];

      // 이번달 달성률
      const totalCount = workouts.length;
      const doneCount = workouts.filter((w) => w.isCompleted).length;
      const monthlyRate =
        totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

      // 요일별 달성률 (월~일 순서: 1,2,3,4,5,6,0)
      const weeklyRates = [1, 2, 3, 4, 5, 6, 0].map((dayIndex) => {
        const dayWorkouts = workouts.filter((w) => w.day === dayIndex);
        if (dayWorkouts.length === 0) return 0;
        const done = dayWorkouts.filter((w) => w.isCompleted).length;
        return Math.round((done / dayWorkouts.length) * 100);
      });

      // 최고 스트릭
      const bestStreak = habitList.reduce(
        (max, h) => Math.max(max, h.streak || 0),
        0,
      );

      // 이번달 히트맵
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const heatmap = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dayWorkouts = workouts.filter((w) => {
          const d = new Date(w.createdAt);
          return d.getDate() === day;
        });
        const done = dayWorkouts.filter((w) => w.isCompleted).length;
        const level = done === 0 ? 0 : done <= 1 ? 1 : done <= 3 ? 2 : 3;
        return { day, level };
      });

      set({
        statsData: {
          weeklyRates,
          monthlyRate,
          totalCompleted: doneCount,
          bestStreak,
          heatmap,
        },
      });
    } catch (error) {
      console.error("통계 페칭 중 오류:", error);
    } finally {
      set({ isSkeleton: false });
    }
  },
}));
