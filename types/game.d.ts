import { TTFEBoard } from "../components/2048Game";
import { SudokuGrid } from "../components/Sudoku";

interface GamesData {
  sudokuGrid?: SudokuGrid;
  ttfeGameData?: TTFEGameData;
}

interface TTFEGameData {
  ttfeBoard: TTFEBoard;
  ttfeScore: number;
}
