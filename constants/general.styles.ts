import { StyleSheet } from "react-native";

export const GENERAL_STYLES = StyleSheet.create({
  generalPadding: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  horizontalPadding: {
    paddingHorizontal: 20,
  },
  flexCol: {
    flexDirection: "column",
  },
  flexRow: {
    flexDirection: "row",
  },
  flexGap: {
    gap: 10,
  },
  flexGrow: {
    flex: 1,
  },
  title: {
    fontSize: 22,
  },
  alignCenter: {
    alignItems: "center",
  },
  textCenter: {
    textAlign: "center",
    justifyContent: "center",
  },
  navBar: {
    marginBottom: 10,
    paddingHorizontal: 20,
    height: "20%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navBarRigth: {
    flexGrow: 0.1,
  },
});
