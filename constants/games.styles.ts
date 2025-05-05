import { StyleSheet } from "react-native";

export const GAME_STYLES = StyleSheet.create({
  sudukuContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sudokuGrid: {
    borderWidth: 2,
    borderColor: "#000",
  },
  sudokuRow: {
    flexDirection: "row",
  },
  sudokuCell: {
    width: 40,
    height: 40,
    borderWidth: 0.5,
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  sudokuSelectedCell: {
    backgroundColor: "#e3f2fd",
  },
  sudokuNormalCell: {
    backgroundColor: "#f5f5f5",
  },
  sudokuValidCell: {
    color: "black",
    fontWeight: "bold",
  },
  sudokuNotValidCell: {
    color: "red",
  },
  sudokuBottomBorder: {
    borderBottomWidth: 2,
  },
  sudokuRightBorder: {
    borderRightWidth: 2,
  },
  sudoukuCellText: {
    fontSize: 20,
  },
  sudokuNumberPad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
    width: 180,
  },
  sudokuNumberButton: {
    width: 50,
    height: 50,
    margin: 5,
    backgroundColor: "black",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  sudokuNumberButtonText: {
    color: "white",
    fontSize: 24,
  },
});
