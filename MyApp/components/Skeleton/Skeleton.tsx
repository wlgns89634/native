import React, { useEffect, useRef } from "react";
import { Animated, DimensionValue, ViewStyle } from "react-native";

interface SkeletonProps {
  width: DimensionValue;
  height: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

const SkeletonItem = ({
  width,
  height,
  borderRadius = 4,
  style,
}: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // 깜빡이는 애니메이션 설정
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width,
          height: height,
          borderRadius,
          backgroundColor: "#E1E9EE", // 스켈레톤 기본 배경색
          opacity,
        },
        style,
      ]}
    />
  );
};

export default SkeletonItem;
