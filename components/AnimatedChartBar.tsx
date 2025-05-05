import React, { useEffect } from "react";
import { Rect } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

// Create an animatable version of the Svg Rect component
const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface AnimatedBarProps {
  x: number;
  yBase: number;
  width: number;
  targetHeight: number;
  color: string;
  delay: number;
  duration: number;
  rx: number;
  ry: number;
}

export const AnimatedChartBar: React.FC<AnimatedBarProps> = ({
  x,
  yBase,
  width,
  targetHeight,
  color,
  delay,
  duration,
  rx,
  ry,
}) => {
  const animatedBarHeight = useSharedValue(0);

  useEffect(() => {
    animatedBarHeight.value = withDelay(
      delay,
      withTiming(targetHeight, {
        duration: duration,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [targetHeight]);

  const animatedProps = useAnimatedProps(() => {
    const currentHeight = animatedBarHeight.value;
    const currentY = yBase - currentHeight;

    return {
      height: Math.max(0, currentHeight),
      y: currentY,
    };
  });

  return (
    <AnimatedRect
      x={x}
      width={width}
      fill={color}
      animatedProps={animatedProps}
      rx={rx}
      ry={ry}
    />
  );
};
