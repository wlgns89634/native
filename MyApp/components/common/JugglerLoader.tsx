import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const DURATION = 6000; // 6초 루프

const JugglerLoader = () => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: 100,
        duration: DURATION,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  // --- 공통 Interpolate 함수 ---
  const getBallAnim = (
    input: number[],
    outputX: number[],
    outputY: number[],
    outputOp?: number[],
  ) => {
    return {
      transform: [
        {
          translateX: anim.interpolate({
            inputRange: input,
            outputRange: outputX,
          }),
        },
        {
          translateY: anim.interpolate({
            inputRange: input,
            outputRange: outputY,
          }),
        },
      ],
      opacity: outputOp
        ? anim.interpolate({ inputRange: input, outputRange: outputOp })
        : 1,
    };
  };

  // --- 애니메이션 수치 매핑 (CSS %를 0-100 범위로 변환) ---
  const headRotate = anim.interpolate({
    inputRange: [0, 50, 55, 60, 65, 70, 75, 80, 100],
    outputRange: [
      "0deg",
      "0deg",
      "8deg",
      "-8deg",
      "8deg",
      "-8deg",
      "0deg",
      "-20deg",
      "-20deg",
    ],
  });

  const rightArmRotate = anim.interpolate({
    inputRange: [
      0, 4.16, 8.33, 12.5, 16.66, 20.83, 25, 29.16, 33.33, 37.5, 41.66, 45.83,
      50, 55, 60, 68, 75, 100,
    ],
    outputRange: [
      "-50deg",
      "-10deg",
      "-50deg",
      "-10deg",
      "-50deg",
      "-10deg",
      "-50deg",
      "-10deg",
      "-50deg",
      "-10deg",
      "-50deg",
      "-10deg",
      "-50deg",
      "-70deg",
      "0deg",
      "-80deg",
      "10deg",
      "10deg",
    ],
  });

  const leftArmRotate = anim.interpolate({
    inputRange: [
      0, 4.16, 8.33, 12.5, 16.66, 20.83, 25, 29.16, 33.33, 37.5, 41.66, 45.83,
      50, 55, 62, 70, 75, 100,
    ],
    outputRange: [
      "40deg",
      "10deg",
      "40deg",
      "10deg",
      "40deg",
      "10deg",
      "40deg",
      "10deg",
      "40deg",
      "10deg",
      "40deg",
      "10deg",
      "40deg",
      "60deg",
      "-10deg",
      "70deg",
      "-10deg",
      "-10deg",
    ],
  });

  return (
    <View style={styles.wrapper}>
      {/* 저글러 몸체 */}
      <View style={styles.juggler}>
        <Animated.View
          style={[styles.head, { transform: [{ rotate: headRotate }] }]}
        />
        <View style={styles.body} />
        <Animated.View
          style={[
            styles.arm,
            styles.rightArm,
            { transform: [{ rotate: rightArmRotate }] },
          ]}
        />
        <Animated.View
          style={[
            styles.arm,
            styles.leftArm,
            { transform: [{ rotate: leftArmRotate }] },
          ]}
        />
      </View>

      {/* 공 1 (빨강) */}
      <Animated.View
        style={[
          styles.ball,
          { backgroundColor: "#ff4757" },
          getBallAnim(
            [
              0, 8.33, 16.66, 25, 33.33, 41.66, 50, 58.33, 66.66, 75, 80, 85,
              90, 95, 100,
            ],
            [25, 0, -25, 25, 0, -25, 25, 15, -30, 30, 35, 40, 45, 45, 45],
            [20, -45, 20, 20, -45, 20, 20, -65, 30, 15, 60, 50, 60, 60, 60],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
          ),
        ]}
      />

      {/* 공 2 (파랑) */}
      <Animated.View
        style={[
          styles.ball,
          { backgroundColor: "#1e90ff" },
          getBallAnim(
            [
              0, 8.33, 16.66, 25, 33.33, 41.66, 50, 58.33, 66.66, 75, 83, 88,
              93, 98, 100,
            ],
            [
              -25, 25, 0, -25, 25, 0, -25, 35, -10, -35, -40, -45, -50, -50,
              -50,
            ],
            [20, 20, -45, 20, 20, -45, 20, 10, -55, 25, 60, 52, 60, 60, 60],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
          ),
        ]}
      />

      {/* 공 3 (초록) */}
      <Animated.View
        style={[
          styles.ball,
          { backgroundColor: "#2ed573" },
          getBallAnim(
            [
              0, 8.33, 16.66, 25, 33.33, 41.66, 50, 58.33, 66.66, 75, 81, 86,
              91, 96, 100,
            ],
            [0, -25, 25, 0, -25, 25, 0, -15, 35, 5, 10, 15, 20, 20, 20],
            [-45, 20, 20, -45, 20, 20, -45, 35, 0, -15, 60, 55, 60, 60, 60],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
          ),
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  juggler: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  head: {
    width: 24,
    height: 24,
    backgroundColor: "#2c3e50",
    borderRadius: 12,
    position: "absolute",
    top: -34,
    left: -12,
  },
  body: {
    width: 16,
    height: 40,
    backgroundColor: "#2c3e50",
    borderRadius: 8,
    position: "absolute",
    top: -5,
    left: -8,
  },
  arm: {
    width: 8,
    height: 32,
    backgroundColor: "#2c3e50",
    borderRadius: 4,
    position: "absolute",
    top: -2,
  },
  rightArm: {
    left: 2,
    transformOrigin: "top", // RN에서는 4px 4px 대신 보통 'top'으로 설정
  },
  leftArm: {
    left: -10,
    transformOrigin: "top",
  },
  ball: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -7, // 중앙 정렬 보정
    marginLeft: -7,
  },
});

export default JugglerLoader;
