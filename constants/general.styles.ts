import { StyleSheet } from "react-native";

export const grayColor = "#343233"
export const whiteColor = "#D9D9D9"
export const whiteBackgroundColor = "#E5E1DE"

export const GENERAL_STYLES = StyleSheet.create({
  baseScreenPadding: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  smallPadding: {
    padding: 10,
  },
  generalPadding: {
    padding: 20,
  },
  horizontalPadding: {
    paddingHorizontal: 20,
  },
  paddingBottom: {
    paddingBottom: 20,
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
  flexGapSmall: {
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
  alignStart: {
    alignItems: 'flex-start'
  },
  uiText: {
    fontFamily: "Inter",
  },
  textTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textTitleBig: {
    fontSize: 25,
    marginBottom: 40,
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
  textBlack: {
    color: grayColor,
  },
  textWhite: {
    color: whiteColor
  },
  textGray: {
    color: "gray",
  },
  navBar: {
    fontFamily: "Inter",
    fontSize: 20,
    fontWeight: "bold",
  },
  navBarRigth: {
    flexGrow: 0.1,
  },
  whiteBackgroundColor: {
    backgroundColor: whiteBackgroundColor,
  },
  grayBackgroundColor: {
    backgroundColor: grayColor
  },
  justifyCenter: {
    justifyContent: "center",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  loginSignInButton: {
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  generalBorder: {
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
  },
  defaultBorder: {
    borderStyle: "solid",
    borderColor: grayColor,
    borderWidth: 2.5,
  },
  uiButton: {
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "black",
  },
  buttonDisabled: {
    opacity: 0.5,
    borderWidth: 0,
  },
  floatingRightButton: {
    width: 60,
    height: 60,
    borderRadius: 10,
    position: "absolute",
    bottom: 40,
    right: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  navigationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  navigationHeaderSideBalanceSpace: {
    width: 40,
  }
});
