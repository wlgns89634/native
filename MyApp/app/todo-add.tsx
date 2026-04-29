import JugglerLoader from "@/components/common/JugglerLoader";
import { useColors } from "@/hooks/useColors";
import { useAllStore } from "@/store/useAllStore";
import { useThemeStore } from "@/store/useThemeStore";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
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

const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatTime = (date: Date): string => {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

export default function TodoAddScreen() {
  const Colors = useColors();
  const { isDark } = useThemeStore();
  const styles = makeStyles(Colors, isDark);

  // ✅ id가 있으면 수정 모드
  const { date, id } = useLocalSearchParams<{ date?: string; id?: string }>();
  const isEditMode = !!id;

  const { addTodo, updateTodo, todos, isLoading } = useAllStore();

  const existingTodo = isEditMode ? todos.find((t) => t.id === id) : null;

  // ✅ 수정 모드면 기존 값으로 초기화
  const initialDate = existingTodo?.date
    ? new Date(existingTodo.date)
    : date
      ? new Date(date)
      : new Date();

  const parseInitialTime = (): Date | null => {
    if (!existingTodo?.time) return null;
    const [h, m] = existingTodo.time.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  const [title, setTitle] = useState(existingTodo?.title ?? "");
  const [selectedIcon, setSelectedIcon] = useState(
    (existingTodo as any)?.icon ?? "📅",
  );
  const [selectedType, setSelectedType] = useState<
    "habit" | "workout" | "custom"
  >((existingTodo as any)?.type ?? "custom");
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [selectedTime, setSelectedTime] = useState<Date | null>(
    parseInitialTime(),
  );
  const [hasTime, setHasTime] = useState(!!existingTodo?.time);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [androidDateVisible, setAndroidDateVisible] = useState(false);
  const [androidTimeVisible, setAndroidTimeVisible] = useState(false);

  useEffect(() => {
    if (isEditMode && !existingTodo) router.back();
  }, []);

  const onDateChange = (event: DateTimePickerEvent, newDate?: Date) => {
    if (Platform.OS === "android") {
      setAndroidDateVisible(false);
      if (event.type === "dismissed") return;
    }
    if (newDate) setSelectedDate(newDate);
  };

  const onTimeChange = (event: DateTimePickerEvent, newDate?: Date) => {
    if (Platform.OS === "android") {
      setAndroidTimeVisible(false);
      if (event.type === "dismissed") return;
    }
    if (newDate) {
      setSelectedTime(newDate);
      setHasTime(true);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("입력 오류", "일정 이름을 입력해주세요.");
      return;
    }

    Alert.alert(
      isEditMode ? "일정 수정" : "일정 저장",
      isEditMode
        ? "일정을 수정하시겠습니까?"
        : "새로운 일정을 등록하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "저장",
          onPress: async () => {
            try {
              const payload = {
                title: title.trim(),
                date: formatDate(selectedDate),
                time: hasTime && selectedTime ? formatTime(selectedTime) : "",
              };

              if (isEditMode) {
                await updateTodo(id, payload);
              } else {
                await addTodo(payload);
              }

              router.back();
            } catch (error) {
              console.error(error);
              Alert.alert("오류", "저장 중 오류가 발생했습니다.");
            }
          },
        },
      ],
    );
  };

  const openDatePicker = () => {
    if (Platform.OS === "ios") setShowDatePicker(true);
    else setAndroidDateVisible(true);
  };

  const openTimePicker = () => {
    if (Platform.OS === "ios") setShowTimePicker(true);
    else setAndroidTimeVisible(true);
  };

  const clearTime = () => {
    setHasTime(false);
    setSelectedTime(null);
  };

  return (
    <View style={styles.container}>
      {isLoading && <JugglerLoader />}

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? "일정 수정" : "일정 추가"}
        </Text>
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
        {/* 미리보기 */}
        <View style={styles.previewWrap}>
          <View style={styles.previewCard}>
            <Text style={styles.previewIcon}>{selectedIcon}</Text>
            <Text style={styles.previewName}>{title || "일정 이름"}</Text>
          </View>
        </View>

        {/* 날짜 & 시간 선택 */}
        <Text style={styles.sectionTitle}>날짜 & 시간</Text>
        <View style={styles.dateTimeRow}>
          <TouchableOpacity
            style={styles.dateTimeBtn}
            onPress={openDatePicker}
            activeOpacity={0.7}
          >
            <Text style={styles.dateTimeBtnIcon}>📅</Text>
            <Text style={styles.dateTimeBtnText}>
              {formatDate(selectedDate)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dateTimeBtn, hasTime && styles.dateTimeBtnActive]}
            onPress={openTimePicker}
            activeOpacity={0.7}
          >
            <Text style={styles.dateTimeBtnIcon}>🕐</Text>
            <Text
              style={[
                styles.dateTimeBtnText,
                hasTime && { color: Colors.primary },
              ]}
            >
              {hasTime && selectedTime ? formatTime(selectedTime) : "시간 없음"}
            </Text>
          </TouchableOpacity>

          {hasTime && (
            <TouchableOpacity
              style={styles.clearTimeBtn}
              onPress={clearTime}
              activeOpacity={0.7}
            >
              <Text style={styles.clearTimeBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Android DatePicker */}
        {Platform.OS === "android" && androidDateVisible && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        {Platform.OS === "android" && androidTimeVisible && (
          <DateTimePicker
            value={selectedTime ?? new Date()}
            mode="time"
            is24Hour
            display="default"
            onChange={onTimeChange}
          />
        )}

        {/* iOS 모달 */}
        {Platform.OS === "ios" && (
          <>
            <Modal
              visible={showDatePicker}
              transparent
              animationType="slide"
              onRequestClose={() => setShowDatePicker(false)}
            >
              <Pressable
                style={styles.modalOverlay}
                onPress={() => setShowDatePicker(false)}
              >
                <Pressable style={styles.modalSheet}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>날짜 선택</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.modalDone}>완료</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="spinner"
                    onChange={onDateChange}
                    style={styles.iosPicker}
                    locale="ko-KR"
                  />
                </Pressable>
              </Pressable>
            </Modal>

            <Modal
              visible={showTimePicker}
              transparent
              animationType="slide"
              onRequestClose={() => setShowTimePicker(false)}
            >
              <Pressable
                style={styles.modalOverlay}
                onPress={() => setShowTimePicker(false)}
              >
                <Pressable style={styles.modalSheet}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>시간 선택</Text>
                    <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                      <Text style={styles.modalDone}>완료</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={selectedTime ?? new Date()}
                    mode="time"
                    display="spinner"
                    is24Hour
                    onChange={onTimeChange}
                    style={styles.iosPicker}
                    locale="ko-KR"
                  />
                </Pressable>
              </Pressable>
            </Modal>
          </>
        )}

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
    dateTimeRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 24,
      alignItems: "center",
    },
    dateTimeBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: Colors.card,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    dateTimeBtnActive: {
      borderColor: Colors.primary,
      backgroundColor: Colors.primary + "11",
    },
    dateTimeBtnIcon: { fontSize: 16 },
    dateTimeBtnText: { fontSize: 14, color: Colors.text, fontWeight: "500" },
    clearTimeBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: Colors.card,
      borderWidth: 1,
      borderColor: Colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    clearTimeBtnText: { fontSize: 12, color: Colors.subText },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "flex-end",
    },
    modalSheet: {
      backgroundColor: Colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 34,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    modalTitle: { fontSize: 16, fontWeight: "700", color: Colors.text },
    modalDone: { fontSize: 16, fontWeight: "700", color: Colors.primary },
    iosPicker: { height: 200 },
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
