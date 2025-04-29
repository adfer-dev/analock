import { StyleSheet } from "react-native";

export const GENERAL_STYLES = StyleSheet.create({
  generalPadding: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  horizontalPadding: {
    paddingHorizontal: 20,
  },
  marginTop: {
    marginTop: 10,
  },
  flexCol: {
    flexDirection: "column",
  },
  flexRow: {
    flexDirection: "row",
  },
  flexGap: {
    gap: 20,
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
  textBold: {
    fontWeight: "bold",
  },
  textItalic: {
    fontStyle: "italic",
  },
  navBar: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "bold",
  },
  navBarRigth: {
    flexGrow: 0.1,
  },
  backgroundColor: {
    backgroundColor: "#e9e9e9",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
});
