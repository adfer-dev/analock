import { StyleSheet } from "react-native";

export const HOME_STYLES = StyleSheet.create({
  contentCard: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 240,
    gap: 10,
  },
  contentCardText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 25,
    paddingVertical: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  statusBarTimeText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  statusBarprogressContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  statusBarprogressText: {
    position: "absolute",
    fontSize: 12,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 20,
  },
});
