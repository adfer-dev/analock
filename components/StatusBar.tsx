import { useEffect, useState } from "react";
import { HOME_STYLES } from "../constants/home.styles";
import { StyleSheet, Text, View } from "react-native";
import { Circle, Svg } from "react-native-svg";
import {
  getStorageBooks,
  getStorageGamesData,
} from "../services/storage.services";
import { GENERAL_STYLES } from "../constants/general.styles";

interface StatusBarProperties {
  refresh: boolean;
}

export const StatusBar: React.FC<StatusBarProperties> = ({ refresh }) => {
  const [time, setTime] = useState<Date>(new Date());
  const [progress, setProgress] = useState<number>(0);
  const TOTAL_ACTIVITIES: number = 5;

  // hook to update clock
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // hook to calculate activity progress
  useEffect(() => {
    if (refresh) {
      let completedActivitiesCount = 0;
      const bookData = getStorageBooks();
      const gameData = getStorageGamesData();
      if (bookData) {
        for (const book of bookData) {
          if (book.data.finished) {
            completedActivitiesCount++;
          }
        }
      }

      if (gameData) {
        for (const game of gameData) {
          if (game.won) {
            completedActivitiesCount++;
          }
        }
      }
      setProgress((completedActivitiesCount / TOTAL_ACTIVITIES) * 100);
    }
  }, [refresh]);

  const formattedTime = `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}`;
  return (
    <View style={[HOME_STYLES.statusBar]}>
      <Text style={[GENERAL_STYLES.uiText, styles.timeText]}>
        {formattedTime}
      </Text>
      <View style={styles.progressContainer}>
        <Svg width="60" height="60" viewBox="0 0 100 100">
          <Circle
            cx="50"
            cy="50"
            r="40"
            stroke="#ddd"
            strokeWidth="10"
            fill="none"
          />
          <Circle
            cx="50"
            cy="50"
            r="40"
            stroke="#AF47D2"
            strokeWidth="10"
            fill="none"
            strokeDasharray={Math.PI * 2 * 40}
            strokeDashoffset={(1 - progress / 100) * Math.PI * 2 * 40}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </Svg>
        <Text style={[GENERAL_STYLES.uiText, styles.progressText]}>
          {progress}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    width: "90%",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 5,
    position: "absolute",
    top: 20,
  },
  timeText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    position: "absolute",
    fontSize: 12,
    fontWeight: "bold",
  },
  grid: {
    marginTop: 100,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  gridItem: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 5,
    margin: 10,
  },
});
