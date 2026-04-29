import JugglerLoader from "@/components/common/JugglerLoader";
import { useColors } from "@/hooks/useColors";
import { Todo, useAllStore } from "@/store/useAllStore";
import { useThemeStore } from "@/store/useThemeStore";
import { CommonStyles } from "@/styles/common.style";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

export default function TodoDetailScreen() {
  const Colors = useColors();
  const { isDark } = useThemeStore();
  const styles = makeStyles(Colors, isDark);
  const cmStyles = CommonStyles(Colors, isDark);

  const { date } = useLocalSearchParams<{ date: string }>();
  const { todos, fetchTodos, deleteTodo, updateTodo, isTodoLoading } =
    useAllStore();

  useEffect(() => {
    if (date) fetchTodos(date);
  }, [date]);

  // 날짜 포맷: "2025-01-15" → "1월 15일"
  const formatDisplayDate = (d: string) => {
    const [, m, day] = d.split("-");
    return `${parseInt(m)}월 ${parseInt(day)}일`;
  };

  const handleToggle = async (item: Todo) => {
    await updateTodo(item.id, {
      isCompleted: !(item as any).isCompleted,
    } as any);
    fetchTodos(date);
  };

  const handleDelete = (id: string) => {
    Alert.alert("삭제", "이 일정을 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await deleteTodo(id);
          fetchTodos(date);
        },
      },
    ]);
  };

  const renderRightActions = (item: Todo) => (
    <View style={cmStyles.rightActionWrap}>
      <TouchableOpacity
        style={cmStyles.editAction}
        onPress={() =>
          router.push({
            pathname: "/todo-add",
            params: { id: item.id, date: item.date },
          })
        }
      >
        <Text style={cmStyles.editText}>수정</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={cmStyles.deleteAction}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={cmStyles.deleteText}>삭제</Text>
      </TouchableOpacity>
    </View>
  );

  const completedCount = todos.filter((i) => (i as any).isCompleted).length;
  const totalCount = todos.length;
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <View style={styles.container}>
      {isTodoLoading && <JugglerLoader />}

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {date ? formatDisplayDate(date) : ""} 일정
        </Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() =>
            router.push({ pathname: "/todo-add", params: { date } })
          }
        >
          <Text style={styles.addBtnText}>+ 추가</Text>
        </TouchableOpacity>
      </View>

      {/* 달성률 바 */}
      {totalCount > 0 && (
        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>
              {completedCount}/{totalCount} 완료
            </Text>
            <Text style={styles.progressPercent}>{percentage}%</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${percentage}%` }]} />
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {todos.length > 0 ? (
          todos.map((item: Todo) => (
            <Swipeable
              key={item.id}
              renderRightActions={() => renderRightActions(item)}
              friction={2}
              enableTrackpadTwoFingerGesture
              rightThreshold={40}
            >
              <TouchableOpacity
                style={[
                  styles.todoCard,
                  (item as any).isCompleted && styles.todoCardDone,
                ]}
                activeOpacity={0.75}
                onPress={() => handleToggle(item)}
              >
                <View style={styles.todoLeft}>
                  {/* 완료 체크박스 */}
                  <View
                    style={[
                      styles.checkbox,
                      (item as any).isCompleted && styles.checkboxDone,
                    ]}
                  >
                    {(item as any).isCompleted && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>

                  <View style={styles.todoInfo}>
                    <Text
                      style={[
                        styles.todoTitle,
                        (item as any).isCompleted && styles.todoDone,
                      ]}
                    >
                      {(item as any).icon ?? "📅"} {item.title}
                    </Text>
                    {item.time ? (
                      <Text style={styles.todoTime}>🕐 {item.time}</Text>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            </Swipeable>
          ))
        ) : (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>이 날은 일정이 없어요</Text>
            <TouchableOpacity
              style={styles.emptyAddBtn}
              onPress={() =>
                router.push({ pathname: "/todo-add", params: { date } })
              }
            >
              <Text style={styles.emptyAddBtnText}>+ 일정 추가</Text>
            </TouchableOpacity>
          </View>
        )}

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
    addBtn: {
      backgroundColor: Colors.primary,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    addBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },

    // 달성률
    progressSection: {
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    progressRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    progressLabel: { fontSize: 13, color: Colors.subText },
    progressPercent: {
      fontSize: 13,
      fontWeight: "700",
      color: Colors.primary,
    },
    progressBg: {
      height: 6,
      backgroundColor: Colors.border,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressFill: {
      height: 6,
      backgroundColor: Colors.primary,
      borderRadius: 3,
    },

    content: { padding: 20 },

    // 할 일 카드
    todoCard: {
      backgroundColor: Colors.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    todoCardDone: {
      opacity: 0.55,
    },
    todoLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: Colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxDone: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
    },
    checkmark: { color: "#fff", fontSize: 13, fontWeight: "700" },
    todoInfo: { flex: 1 },
    todoTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: Colors.text,
      marginBottom: 4,
    },
    todoDone: {
      textDecorationLine: "line-through",
      color: Colors.subText,
    },
    todoTime: { fontSize: 12, color: Colors.subText },

    // 빈 상태
    emptyWrap: { alignItems: "center", paddingTop: 60 },
    emptyIcon: { fontSize: 48, marginBottom: 12 },
    emptyText: { fontSize: 15, color: Colors.subText, marginBottom: 20 },
    emptyAddBtn: {
      backgroundColor: Colors.primary,
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    emptyAddBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  });
