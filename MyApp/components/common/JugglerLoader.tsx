import { useEffect, useRef } from "react";
import { Animated, Modal, StyleSheet, View } from "react-native";

export default function JugglerLoader() {
  const ball1X = useRef(new Animated.Value(0)).current;
  const ball1Y = useRef(new Animated.Value(0)).current;
  const ball2X = useRef(new Animated.Value(0)).current;
  const ball2Y = useRef(new Animated.Value(0)).current;
  const ball3X = useRef(new Animated.Value(0)).current;
  const ball3Y = useRef(new Animated.Value(0)).current;
  const armR = useRef(new Animated.Value(-50)).current;
  const armL = useRef(new Animated.Value(40)).current;

  const loop = (anim: Animated.CompositeAnimation) =>
    Animated.loop(anim).start();

  useEffect(() => {
    loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ball1X, {
            toValue: 25,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(ball1Y, {
            toValue: 20,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ball1X, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(ball1Y, {
            toValue: -45,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ball1X, {
            toValue: -25,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(ball1Y, {
            toValue: 20,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ball2X, {
            toValue: -25,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(ball2Y, {
            toValue: 20,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ball2X, {
            toValue: 25,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(ball2Y, {
            toValue: 20,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ball2X, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(ball2Y, {
            toValue: -45,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ball3X, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(ball3Y, {
            toValue: -45,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ball3X, {
            toValue: -25,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(ball3Y, {
            toValue: 20,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ball3X, {
            toValue: 25,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(ball3Y, {
            toValue: 20,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    loop(
      Animated.sequence([
        Animated.timing(armR, {
          toValue: -10,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(armR, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    );

    loop(
      Animated.sequence([
        Animated.timing(armL, {
          toValue: 10,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(armL, {
          toValue: 40,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    );
  }, []);

  return (
    <Modal transparent animationType="fade" visible={true}>
      {/* 반투명 배경 - 화면 꽉 채움 */}
      <View style={styles.overlay}>
        {/* 애니메이션 캐릭터 */}
        <View style={styles.wrapper}>
          <View style={styles.body} />
          <View style={styles.head} />

          <Animated.View
            style={[
              styles.arm,
              styles.rightArm,
              {
                transform: [
                  {
                    rotate: armR.interpolate({
                      inputRange: [-90, 90],
                      outputRange: ["-90deg", "90deg"],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.arm,
              styles.leftArm,
              {
                transform: [
                  {
                    rotate: armL.interpolate({
                      inputRange: [-90, 90],
                      outputRange: ["-90deg", "90deg"],
                    }),
                  },
                ],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.ball,
              styles.ball1,
              { transform: [{ translateX: ball1X }, { translateY: ball1Y }] },
            ]}
          />
          <Animated.View
            style={[
              styles.ball,
              styles.ball2,
              { transform: [{ translateX: ball2X }, { translateY: ball2Y }] },
            ]}
          />
          <Animated.View
            style={[
              styles.ball,
              styles.ball3,
              { transform: [{ translateX: ball3X }, { translateY: ball3Y }] },
            ]}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  head: {
    width: 24,
    height: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    position: "absolute",
    top: 10,
  },
  body: {
    width: 16,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 8,
    position: "absolute",
    top: 34,
  },
  arm: {
    width: 8,
    height: 32,
    backgroundColor: "#fff",
    borderRadius: 4,
    position: "absolute",
    top: 36,
  },
  rightArm: { left: 64 },
  leftArm: { left: 48 },
  ball: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: "absolute",
    top: 48,
    left: 53,
  },
  ball1: { backgroundColor: "#ff4757" },
  ball2: { backgroundColor: "#1e90ff" },
  ball3: { backgroundColor: "#2ed573" },
});
