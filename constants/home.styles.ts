import { StyleSheet } from "react-native";

export const HOME_STYLES = StyleSheet.create({
  contentCard: {
    padding: 60,
    width: "47%",
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  contentCardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
  },
  statusBar: {
    marginBottom: 20,
    padding: 20,
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
  },
});
