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

interface AllStore {
  // 습관 상태 및 액션
  habits: Habit[];
  fetchHabits: () => Promise<void>;
  addHabit: (habit: Omit<Habit, "id" | "createdAt">) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabit: (id: string, current: boolean) => Promise<void>;

  // 운동 상태 및 액션
  workouts: Workout[];
  fetchWorkouts: () => Promise<void>;
  addWorkout: (workout: Omit<Workout, "id" | "createdAt">) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  toggleWorkout: (id: string, current: boolean) => Promise<void>;

  // 공통 UI 상태
  isSkeleton: boolean;
  isLoading: boolean;
}

export const useAllStore = create<AllStore>((set) => ({
  habits: [],
  workouts: [],
  isSkeleton: false,
  isLoading: false,

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
        .eq("week", week) // 이번 주 데이터만 로드
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
      // 1. 운동 부위(Header) 먼저 추가
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

      const workoutId = data[0].id;

      // Zustand 상태 업데이트 (화면에 즉시 반영)
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
      // Supabase 설정(Cascade)에 따라 exercises는 자동 삭제되거나 따로 처리 필요
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
}));
