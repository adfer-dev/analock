import { View } from "react-native";
import { Circle, Svg } from "react-native-svg";

interface RegistrationCircleProps {
  color: string;
}

export const RegistrationCircle: React.FC<RegistrationCircleProps> = ({
  color,
}) => {
  return (
    <View style={{ width: 15, height: 15 }}>
      <Svg width="100%" height="100%" viewBox="0 0 200 200">
        <Circle cx="100" cy="100" r="80" fill={color} />
      </Svg>
    </View>
  );
};
