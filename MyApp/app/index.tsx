import { Redirect } from "expo-router";

// export default function Index() {
//   return <Redirect href="/(tabs)/habit" />;
// }

import { StyleSheet } from "react-native";

export default function Index() {
  return <Redirect href="/(tabs)/habit" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // 화면 전체를 채우도록 설정
    backgroundColor: "#fff", // 배경색 지정
  },
});
