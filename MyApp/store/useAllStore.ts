import { supabase } from "@/lib/supabase";
import { Exercise, Habit, Workout } from "@/types";
import { create } from "zustand";

interface AllStore {
  // 습관
  habits: Habit[];
  fetchHabits: () => Promise<void>;
  addHabit: (habit: Omit<Habit, "id" | "createdAt">) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabit: (id: string, current: boolean) => Promise<void>;

  // 운동
  workouts: Workout[];
  fetchWorkouts: () => Promise<void>;
  addWorkout: (
    workout: Omit<Workout, "id" | "createdAt">,
    exercises: Omit<Exercise, "id">[],
  ) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  toggleWorkout: (id: string, current: boolean) => Promise<void>;
  isLoading: boolean;
}

export const useAllStore = create<AllStore>((set) => ({
  habits: [],
  isLoading: false,

  // 습관 불러오기
  fetchHabits: async () => {
    set({ isLoading: true });

    try {
      const { data } = await supabase
        .from("habits")
        .select("*")
        .order("createdAt", { ascending: true });
      set({ habits: data || [] });
    } catch (error) {
      console.error(error);
      return;
    } finally {
      set({ isLoading: false });
    }
  },

  // 습관 추가
  addHabit: async (habit) => {
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

    if (error) {
      console.error(error);
      return;
    }
    if (data) set((state) => ({ habits: [...state.habits, data[0]] }));
  },

  // 습관 삭제
  deleteHabit: async (id) => {
    const { error } = await supabase.from("habits").delete().eq("id", id);

    if (error) {
      console.error(error);
      return;
    }
    set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }));
  },

  // 습관 완료 토글
  toggleHabit: async (id, current) => {
    const { error } = await supabase
      .from("habits")
      .update({ isCompleted: !current })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id ? { ...h, isCompleted: !current } : h,
      ),
    }));
  },

  // 운동 불러오기
  workouts: [],
  fetchWorkouts: async () => {
    const { data, error } = await supabase
      .from("workouts")
      .select(`*, exercises(*)`)
      .order("createdAt", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }
    set({ workouts: data || [] });
  },

  // 운동 추가
  addWorkout: async (workout, exercises) => {
    const { data, error } = await supabase
      .from("workouts")
      .insert([
        {
          name: workout.name,
          icon: workout.icon,
          isCompleted: false,
        },
      ])
      .select();

    if (error || !data) {
      console.error(error);
      return;
    }

    const workoutId = data[0].id;

    // 종목 추가
    const { error: exError } = await supabase.from("exercises").insert(
      exercises.map((e) => ({
        workout_id: workoutId,
        name: e.name,
        sets: e.sets,
        reps: e.reps,
        weight: e.weight,
      })),
    );

    if (exError) {
      console.error(exError);
      return;
    }

    set((state) => ({
      workouts: [...state.workouts, { ...data[0], exercises }],
    }));
  },

  // 운동 삭제
  deleteWorkout: async (id) => {
    const { error } = await supabase.from("workouts").delete().eq("id", id);

    if (error) {
      console.error(error);
      return;
    }
    set((state) => ({
      workouts: state.workouts.filter((w) => w.id !== id),
    }));
  },

  // 운동 완료 토글
  toggleWorkout: async (id, current) => {
    const { error } = await supabase
      .from("workouts")
      .update({ isCompleted: !current })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }
    set((state) => ({
      workouts: state.workouts.map((w) =>
        w.id === id ? { ...w, isCompleted: !current } : w,
      ),
    }));
  },
}));
