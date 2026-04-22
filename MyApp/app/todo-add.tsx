import JugglerLoader from "@/components/common/JugglerLoader";
import { useColors } from "@/hooks/useColors";
import { useAllStore } from "@/store/useAllStore";
import { useThemeStore } from "@/store/useThemeStore";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ICONS = [
  "📅",
  "💼",
  "🏥",
  "✈️",
  "🎂",
  "🎓",
  "💇",
  "🛒",
  "📞",
  "💰",
  "🎮",
  "🍽️",
  "🚗",
  "👨‍👩‍👧",
  "📝",
  "⚽",
];

const TYPES = [
  { label: "일반", value: "custom", color: "#6C63FF" },
  { label: "습관", value: "habit", color: "#1D9E75" },
  { label: "운동", value: "workout", color: "#FF6584" },
];

export default function TodoAddScreen() {
  const Colors = useColors();
  const { isDark } = useThemeStore();
  const styles = makeStyles(Colors, isDark);

  const { date } = useLocalSearchParams<{ date: string }>();
  const { addTodo, isLoading } = useAllStore();

  const [title, setTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("📅");
  const [selectedType, setSelectedType] = useState<
    "habit" | "workout" | "custom"
  >("custom");

  const handleSave = async () => {
    if (!title.trim()) return;

    await addTodo({
      title: title.trim(),
      date,
      time: "",
    });

    if (router.canGoBack()) router.back();
  };

  return (
    <View style={styles.container}>
      {isLoading && <JugglerLoader />}

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일정 추가</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveBtn, !title.trim() && styles.saveBtnDisabled]}
          disabled={!title.trim()}
        >
          <Text style={styles.saveText}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 날짜 표시 */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeText}>📅 {date}</Text>
        </View>

        {/* 미리보기 */}
        <View style={styles.previewWrap}>
          <View style={styles.previewCard}>
            <Text style={styles.previewIcon}>{selectedIcon}</Text>
            <Text style={styles.previewName}>{title || "일정 이름"}</Text>
            <View
              style={[
                styles.previewBadge,
                {
                  backgroundColor:
                    TYPES.find((t) => t.value === selectedType)?.color + "22",
                },
              ]}
            >
              <Text
                style={[
                  styles.previewBadgeText,
                  { color: TYPES.find((t) => t.value === selectedType)?.color },
                ]}
              >
                {TYPES.find((t) => t.value === selectedType)?.label}
              </Text>
            </View>
          </View>
        </View>

        {/* 타입 선택 */}
        <Text style={styles.sectionTitle}>종류</Text>
        <View style={styles.typeRow}>
          {TYPES.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.typeItem,
                selectedType === type.value && {
                  backgroundColor: type.color + "22",
                  borderColor: type.color,
                },
              ]}
              onPress={() => setSelectedType(type.value as any)}
            >
              <Text
                style={[
                  styles.typeText,
                  selectedType === type.value && {
                    color: type.color,
                    fontWeight: "700",
                  },
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
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

        {/* 일정 이름 */}
        <Text style={styles.sectionTitle}>일정 이름</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="예) 병원 예약"
          placeholderTextColor={Colors.subText}
          maxLength={30}
        />
        <Text style={styles.inputCount}>{title.length}/30</Text>

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
    dateBadge: {
      alignSelf: "center",
      backgroundColor: Colors.card,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: Colors.border,
      marginBottom: 24,
    },
    dateBadgeText: { fontSize: 13, color: Colors.subText, fontWeight: "500" },
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
      marginBottom: 8,
    },
    previewBadge: {
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 20,
    },
    previewBadgeText: { fontSize: 12, fontWeight: "600" },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: Colors.text,
      marginBottom: 12,
      marginTop: 8,
    },
    typeRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
    typeItem: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: Colors.card,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: "center",
    },
    typeText: { fontSize: 14, color: Colors.subText, fontWeight: "500" },
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
  });
