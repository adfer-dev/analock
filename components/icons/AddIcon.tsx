import { View } from "react-native";
import { G, Path, Svg } from "react-native-svg";

export const AddIcon: React.FC = () => {
  const size = 40;
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <G>
          <Path
            d="M6 12H12M12 12H18M12 12V18M12 12V6"
            stroke={"#ffffff"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
      </Svg>
    </View>
  );
};
