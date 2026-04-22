import JugglerLoader from "@/components/common/JugglerLoader";
import { useColors } from "@/hooks/useColors";
import { useAllStore } from "@/store/useAllStore";
import { useThemeStore } from "@/store/useThemeStore";
import { Exercise } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ICONS = [
  "💧",
  "📚",
  "🧘",
  "✏️",
  "🏋️",
  "🍎",
  "😴",
  "🎯",
  "💊",
  "🧹",
  "🎵",
  "🌿",
  "🚶",
  "💻",
  "🧠",
  "❤️",
];

const DAYS = [
  { label: "월", value: 1 },
  { label: "화", value: 2 },
  { label: "수", value: 3 },
  { label: "목", value: 4 },
  { label: "금", value: 5 },
  { label: "토", value: 6 },
  { label: "일", value: 0 },
];

const TIMES = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

const createExercise = (): Exercise => ({
  id: Date.now().toString(),
  name: "",
  sets: 3,
  reps: 10,
  weight: 0,
});

export default function WorkAddScreen() {
  const Colors = useColors();
  const { isDark } = useThemeStore();
  const styles = makeStyles(Colors, isDark);

  // ✅ id가 있으면 수정 모드, 없으면 추가 모드
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = !!id;

  const { addWorkout, updateWorkout, workouts, isLoading } = useAllStore();

  const existingWorkout = isEditMode ? workouts.find((w) => w.id === id) : null;

  const [selectedIcon, setSelectedIcon] = useState(
    existingWorkout?.icon ?? "💧",
  );
  const [name, setName] = useState(existingWorkout?.name ?? "");
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [selectedDay, setSelectedDay] = useState(
    existingWorkout?.day ?? new Date().getDay(),
  );

  // ✅ 수정 모드인데 데이터 없으면 뒤로가기
  useEffect(() => {
    if (isEditMode && !existingWorkout) router.back();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;

    if (isEditMode) {
      // ✅ 수정 모드
      await updateWorkout(id, {
        name: name.trim(),
        icon: selectedIcon,
        day: selectedDay,
      });
    } else {
      // ✅ 추가 모드
      await addWorkout({
        name: name.trim(),
        icon: selectedIcon,
        isCompleted: false,
        day: selectedDay,
      });
    }

    setTimeout(() => {
      if (router.canGoBack()) router.back();
    }, 100);
  };

  return (
    <View style={styles.container}>
      {isLoading && <JugglerLoader />}

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        {/* ✅ 모드에 따라 타이틀 변경 */}
        <Text style={styles.headerTitle}>
          {isEditMode ? "운동 수정" : "운동 추가"}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveBtn, !name.trim() && styles.saveBtnDisabled]}
          disabled={!name.trim()}
        >
          <Text style={styles.saveText}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 미리보기 */}
        <View style={styles.previewWrap}>
          <View style={styles.previewCard}>
            <Text style={styles.previewIcon}>{selectedIcon}</Text>
            <Text style={styles.previewName}>{name || "운동 이름"}</Text>
            <Text style={styles.previewTime}>⏰ {selectedTime}</Text>
          </View>
        </View>

        {/* 아이콘 선택 */}
        <Text style={styles.sectionTitle}>아이콘</Text>
        <View style={styles.iconGrid}>
          {ICONS.map((icon) => (
            <TouchableOpacity
              key={icon}
              style={[
                styles.iconItem,
                selectedIcon === icon && styles.iconItemSelected,
              ]}
              onPress={() => setSelectedIcon(icon)}
            >
              <Text style={styles.iconText}>{icon}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 요일 선택 */}
        <Text style={styles.sectionTitle}>운동 요일</Text>
        <View style={styles.dayGrid}>
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day.value}
              style={[
                styles.dayItem,
                selectedDay === day.value && styles.dayItemSelected,
              ]}
              onPress={() => setSelectedDay(day.value)}
            >
              <Text
                style={[
                  styles.dayText,
                  selectedDay === day.value && styles.dayTextSelected,
                ]}
              >
                {day.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 운동 이름 */}
        <Text style={styles.sectionTitle}>운동 이름</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="예) 벤치프레스"
          placeholderTextColor={Colors.subText}
          maxLength={20}
        />
        <Text style={styles.inputCount}>{name.length}/20</Text>

        {/* 알림 시간 */}
        <Text style={styles.sectionTitle}>알림 시간</Text>
        <View style={styles.timeGrid}>
          {TIMES.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeItem,
                selectedTime === time && styles.timeItemSelected,
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text
                style={[
                  styles.timeText,
                  selectedTime === time && styles.timeTextSelected,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const makeStyles = (Colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    backBtn: { width: 40 },
    backText: { fontSize: 32, color: Colors.text, lineHeight: 36 },
    headerTitle: { fontSize: 17, fontWeight: "700", color: Colors.text },
    saveBtn: {
      backgroundColor: Colors.primary,
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    saveBtnDisabled: { opacity: 0.4 },
    saveText: { color: "#fff", fontWeight: "700", fontSize: 14 },
    content: { padding: 20 },
    previewWrap: { alignItems: "center", marginBottom: 32 },
    previewCard: {
      backgroundColor: Colors.card,
      borderRadius: 16,
      padding: 24,
      alignItems: "center",
      borderWidth: 1,
      borderColor: Colors.border,
      width: "60%",
    },
    previewIcon: { fontSize: 40, marginBottom: 8 },
    previewName: {
      fontSize: 16,
      fontWeight: "700",
      color: Colors.text,
      marginBottom: 4,
    },
    previewTime: { fontSize: 13, color: Colors.subText },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: Colors.text,
      marginBottom: 12,
      marginTop: 8,
    },
    iconGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 24,
    },
    iconItem: {
      width: 52,
      height: 52,
      borderRadius: 12,
      backgroundColor: Colors.card,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: Colors.border,
    },
    iconItemSelected: {
      borderColor: Colors.primary,
      backgroundColor: "#6C63FF22",
    },
    iconText: { fontSize: 24 },
    input: {
      backgroundColor: Colors.card,
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      color: Colors.text,
      borderWidth: 1,
      borderColor: Colors.border,
      marginBottom: 4,
    },
    inputCount: {
      fontSize: 12,
      color: Colors.subText,
      textAlign: "right",
      marginBottom: 24,
    },
    timeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 24,
    },
    timeItem: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: Colors.card,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    timeItemSelected: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
    },
    timeText: { fontSize: 13, color: Colors.subText, fontWeight: "500" },
    timeTextSelected: { color: "#fff", fontWeight: "700" },
    dayGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    dayItem: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: Colors.card,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: Colors.border,
    },
    dayItemSelected: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    dayText: { fontSize: 14, fontWeight: "600", color: Colors.subText },
    dayTextSelected: { color: "#ffffff", fontWeight: "700" },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999,
    },
  });
