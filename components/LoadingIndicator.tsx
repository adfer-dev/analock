import { ActivityIndicator, Text, View } from "react-native";

interface LoadingIndicatorProps {
  text?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ text }) => {
  return (
    <View>
      <ActivityIndicator size="large" color="black" />
      {text && (
        <Text
          style={{
            textAlign: "center",
            color: "black",
          }}
        >
          {text}
        </Text>
      )}
    </View>
  );
};
