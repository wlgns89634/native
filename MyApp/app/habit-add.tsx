import { useColors } from "@/hooks/useColors";
import { useAllStore } from "@/store/useAllStore";
import { useThemeStore } from "@/store/useThemeStore";

import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// 아이콘 선택 목록
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

// 시간 선택 목록
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

export default function HabitAddScreen() {
  const Colors = useColors();
  const { isDark } = useThemeStore();
  const styles = makeStyles(Colors, isDark);

  const [selectedIcon, setSelectedIcon] = useState("💧");
  const [name, setName] = useState("");
  const [selectedTime, setSelectedTime] = useState("09:00");
  const { addHabit } = useAllStore();

  const handleSave = async () => {
    if (!name.trim()) return;

    await addHabit({
      name: name.trim(),
      icon: selectedIcon,
      time: selectedTime,
      is_completed: false,
      streak: 0,
      created_at: "",
      last_completed_date: "",
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>습관 추가</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveBtn, !name.trim() && styles.saveBtnDisabled]}
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
            <Text style={styles.previewName}>{name || "습관 이름"}</Text>
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

        {/* 습관 이름 */}
        <Text style={styles.sectionTitle}>습관 이름</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="예) 물 2L 마시기"
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

    // 헤더
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

    // 미리보기
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

    // 섹션 타이틀
    sectionTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: Colors.text,
      marginBottom: 12,
      marginTop: 8,
    },

    // 아이콘 그리드
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

    // 이름 입력
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

    // 시간 그리드
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
  });
