import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { getStorageGamesData } from "../services/storage.services";
import { useSaveOnExit } from "../hooks/useSaveOnExit";
import { addUserGameRegistration } from "../services/activityRegistrations.services";
import { emptyDateTime } from "../utils/date.utils";

// Type definitions
export type SudokuGrid = SudokuCell[][];
type Coordinates = { row: number; col: number };

export interface SudokuCell {
  value: number | null;
  editable: boolean;
  valid: boolean;
}

/**
 * Checks if an action is valid.
 *
 * @param grid the Sudoku grid
 * @param number the number to check
 * @param pos the coordinates in the grid at which the number is trying to be placed
 * @returns a boolean indicating whether the action is valid
 */
const isValid = (grid: SudokuGrid, num: number, pos: Coordinates): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[pos.row][x].value === num && pos.col !== x) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][pos.col].value === num && pos.row !== x) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(pos.row / 3) * 3;
  const boxCol = Math.floor(pos.col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (
        grid[boxRow + i][boxCol + j].value === num &&
        pos.row !== boxRow + i &&
        pos.col !== boxCol + j
      )
        return false;
    }
  }

  return true;
};

/**
 * Fills every cell in the Sudoku grid.
 *
 * @param grid the Sudoku grid
 * @returns a boolean indicating whether the sudoku has been filled.
 */
function fillCells(grid: SudokuGrid): boolean {
  let row = 0;
  let col = 0;
  let isEmpty = false;

  for (let i = 0; i < 81; i++) {
    row = Math.floor(i / 9);
    col = i % 9;

    if (grid[row][col].value === null) {
      isEmpty = true;
      break;
    }
  }

  if (!isEmpty) return true;

  for (let num = 1; num <= 9; num++) {
    if (isValid(grid, num, { row, col })) {
      grid[row][col].value = num;
      if (fillCells(grid)) return true;
      grid[row][col].value = null;
    }
  }

  return false;
}

/**
 * Gets the saved sudoku grid or generates a new one.
 *
 * @returns the generated sudoku grid
 */
function generateSudoku(): SudokuGrid {
  let grid: SudokuGrid | undefined = getStorageGamesData()?.sudokuGrid;

  if (!grid) {
    grid = Array(9)
      .fill(null)
      .map(() =>
        Array(9)
          .fill(null)
          .map(() => {
            return { value: null, editable: false, valid: true };
          }),
      );
    // Generate a solved Sudoku and then hide numbers to create a puzzle
    fillCells(grid);
    hideNumbers(grid);
  }

  return grid;
}

/**
 * Hides some cells from the grid to create a Sudoku puzzle.
 *
 * @param grid the Sudoku grid
 */
function hideNumbers(grid: SudokuGrid): void {
  const cellsToHide = 60;

  for (let i = 0; i < cellsToHide; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    const cellToHide = grid[row][col];

    if (cellToHide.value !== null) {
      cellToHide.value = null;
      cellToHide.editable = true;
    }
  }
}

/**
 * Sudoku game component.
 */
export const SudokuGame = () => {
  const [grid, setGrid] = useState<SudokuGrid>(() => generateSudoku());
  const [selectedCell, setSelectedCell] = useState<Coordinates | null>(null);
  useSaveOnExit(grid);

  /**
   * @param row the row where the press action had place
   * @param the column where the press action had place
   */
  function handleCellPress(row: number, col: number): void {
    if (grid[row][col].editable) {
      setSelectedCell({ row, col });
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  !(
                    selectedCell?.row === rowIndex &&
                    selectedCell?.col === colIndex
                  )
                    ? styles.normalCell
                    : styles.selectedCell,
                  (rowIndex + 1) % 3 === 0 && styles.bottomBorder,
                  (colIndex + 1) % 3 === 0 && styles.rightBorder,
                ]}
                onPress={() => handleCellPress(rowIndex, colIndex)}
              >
                <Text
                  style={[
                    styles.cellText,
                    grid[rowIndex][colIndex].valid
                      ? styles.validCell
                      : styles.notValidCell,
                  ]}
                >
                  {cell.value || ""}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <NumberPad
        selectedCell={selectedCell}
        grid={grid}
        setGrid={setGrid}
        setSelectedCell={setSelectedCell}
      />
    </View>
  );
};

interface NumberPadProps {
  selectedCell: Coordinates | null;
  grid: SudokuGrid;
  setGrid: React.Dispatch<React.SetStateAction<SudokuGrid>>;
  setSelectedCell: React.Dispatch<React.SetStateAction<Coordinates | null>>;
}

/**
 * The NumberPad component.
 */
const NumberPad: React.FC<NumberPadProps> = ({
  selectedCell,
  grid,
  setGrid,
  setSelectedCell,
}) => {
  /**
   * Handler function for
   */
  function handleNumberInput(num: number): void {
    if (!selectedCell) return;

    const newGrid = grid.map((rowArr) => rowArr.map((cell) => ({ ...cell })));
    const updatedCell = newGrid[selectedCell.row][selectedCell.col];

    updatedCell.value = num;

    if (isValid(newGrid, num, selectedCell)) {
      updatedCell.valid = true;
      updatedCell.editable = false;

      // Check if the puzzle is solved
      const isSolved = newGrid.every((row) =>
        row.every((cell) => cell.value !== null && cell.valid),
      );

      if (isSolved) {
        const currentDate = new Date();
        emptyDateTime(currentDate);
        addUserGameRegistration({
          gameName: "Sudoku",
          registrationDate: currentDate.valueOf(),
          userId: 1,
        });
        Alert.alert("Congratulations!", "You solved the puzzle!");
      }
    } else {
      updatedCell.valid = false;
    }

    setGrid(newGrid);
    setSelectedCell(null);
  }
  return (
    <View style={styles.numberPad}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <TouchableOpacity
          key={num}
          style={styles.numberButton}
          onPress={() => handleNumberInput(num)}
        >
          <Text style={styles.numberButtonText}>{num}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  grid: {
    borderWidth: 2,
    borderColor: "#000",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 0.5,
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  selectedCell: {
    backgroundColor: "#e3f2fd",
  },
  normalCell: {
    backgroundColor: "#f5f5f5",
  },
  validCell: {
    color: "black",
    fontWeight: "bold",
  },
  notValidCell: {
    color: "red",
  },
  bottomBorder: {
    borderBottomWidth: 2,
  },
  rightBorder: {
    borderRightWidth: 2,
  },
  cellText: {
    fontSize: 20,
  },
  numberPad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
    width: 180,
  },
  numberButton: {
    width: 50,
    height: 50,
    margin: 5,
    backgroundColor: "#2196f3",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  numberButtonText: {
    color: "#fff",
    fontSize: 24,
  },
});
