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
  uiText: {
    fontFamily: "Inter",
  },
  textTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textCenter: {
    textAlign: "center",
    justifyContent: "center",
  },
  navBar: {
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 18,
  },
  navBarRigth: {
    flexGrow: 0.1,
  },
  backgroundColor: {
    backgroundColor: "#e9e9e9",
  },
});
