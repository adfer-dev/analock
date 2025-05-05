import React, { ReactNode } from "react";
import { View } from "react-native";
import { Circle, G, Svg } from "react-native-svg";

interface ProfileCircleContainerProps {
  children: ReactNode;
  iconSize: number;
}

export const ProfileCircleContainer: React.FC<ProfileCircleContainerProps> = ({
  children,
  iconSize,
}) => {
  const size = 100;
  const borderWidth = 2;
  const center = size / 2;
  const radius = center - borderWidth / 2;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill={"transparent"}
          stroke={"black"}
          strokeWidth={borderWidth}
        />

        <G x={(size - iconSize) / 2} y={(size - iconSize) / 2}>
          {children}
        </G>
      </Svg>
    </View>
  );
};
