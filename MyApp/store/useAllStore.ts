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

const HISTORY_PAGE_SIZE = 4;

interface AllStore {
  habits: Habit[];
  fetchHabits: () => Promise<void>;
  addHabit: (habit: Omit<Habit, "id" | "createdAt">) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabit: (id: string, current: boolean) => Promise<void>;

  workouts: Workout[];
  fetchWorkouts: () => Promise<void>;
  addWorkout: (workout: Omit<Workout, "id" | "createdAt">) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  toggleWorkout: (id: string, current: boolean) => Promise<void>;

  weekHistories: WeekHistory[];
  fetchWeekHistories: (limit?: number) => Promise<void>;
  fetchMoreHistories: () => Promise<void>;

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
    try {
      const { error } = await supabase.from("habits").delete().eq("id", id);
      if (error) throw error;
      set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }));
    } catch (error) {
      console.error("습관 삭제 중 오류:", error);
    }
  },

  toggleHabit: async (id, current) => {
    try {
      const { error } = await supabase
        .from("habits")
        .update({ isCompleted: !current })
        .eq("id", id);

      if (error) throw error;
      set((state) => ({
        habits: state.habits.map((h) =>
          h.id === id ? { ...h, isCompleted: !current } : h,
        ),
      }));
    } catch (error) {
      console.error("습관 토글 중 오류:", error);
    }
  },

  // --- [운동(Workout) 관련 로직] ---

  fetchWorkouts: async () => {
    set({ isSkeleton: true });
    const { year, week } = getDateInfo();

    try {
      const { data, error } = await supabase
        .from("workouts")
        .select(`*, exercises(*)`)
        .eq("year", year)
        .eq("week", week)
        .order("createdAt", { ascending: true });

      if (error) throw error;
      set({ workouts: data || [] });
    } catch (error) {
      console.error("운동 페칭 중 오류:", error);
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
    try {
      const { error } = await supabase.from("workouts").delete().eq("id", id);
      if (error) throw error;
      set((state) => ({
        workouts: state.workouts.filter((w) => w.id !== id),
      }));
    } catch (error) {
      console.error("운동 삭제 중 오류:", error);
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
}));
