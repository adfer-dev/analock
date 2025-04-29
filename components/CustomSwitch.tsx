import { Switch, Text, View } from "react-native";
import { GENERAL_STYLES } from "../constants/general.styles";

interface CustomSwitchProps {
  label?: string;
  isEnabled: boolean;
  setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
  label,
  isEnabled,
  setIsEnabled,
}) => {
  return (
    <View
      style={[
        GENERAL_STYLES.flexRow,
        GENERAL_STYLES.alignCenter,
        GENERAL_STYLES.spaceBetween,
      ]}
    >
      <Text style={[GENERAL_STYLES.uiText]}>{label}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "black" }}
        thumbColor={"white"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => {
          setIsEnabled((previousState) => !previousState);
        }}
        value={isEnabled}
      />
    </View>
  );
};
