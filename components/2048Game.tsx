import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useSaveOnExit } from "../hooks/useSaveOnExit";
import {
  getSettings,
  getStorageGamesData,
  getStorageUserData,
} from "../services/storage.services";
import { addUserGameRegistration } from "../services/activityRegistrations.services";
import { emptyDateTime } from "../utils/date.utils";
import { SWIPE_THRESHOLD, TTFE_GAME_NAME } from "../constants/constants";
import { TTFEGameData } from "../types/game";
import { GameWon } from "./GameWon";
import { GENERAL_STYLES } from "../constants/general.styles";
import Animated, { runOnJS, useSharedValue } from "react-native-reanimated";
import { getMatrixColumn, setMatrixColumn } from "../utils/utils";

type Direction = "up" | "down" | "left" | "right";
export type TTFEBoard = number[][];

/**
 *  Interface representing a move status.
 */
interface BoardMoveStatus {
  updatedRow: number[],
  moveScore: number
  moved: boolean
  moveWon: boolean
}

const { width } = Dimensions.get("window");
const BOARD_SIZE = width - 32;
const CELL_SIZE = BOARD_SIZE / 4;
const CELL_MARGIN = 4;
const BOARD_DIMENSIONS = 4
const colors: Record<number, string> = {
  0: "#CDC1B4",
  2: "#EEE4DA",
  4: "#EDE0C8",
  8: "#F2B179",
  16: "#F59563",
  32: "#F67C5F",
  64: "#F65E3B",
  128: "#EDCF72",
  256: "#EDCC61",
  512: "#EDC850",
  1024: "#EDC53F",
  2048: "#EDC22E",
};

export function Game2048() {
  const gamesData = getStorageGamesData();
  const ttfeGameData = getStorageGamesData()?.find(
    (data) => data.name === TTFE_GAME_NAME,
  );
  const [board, setBoard] = useState<TTFEBoard>(() => initializeBoard());
  const [score, setScore] = useState<number>(() => initializeScore());
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(
    ttfeGameData ? ttfeGameData.won : false,
  );
  useSaveOnExit({
    name: TTFE_GAME_NAME,
    data: { ttfeBoard: board, ttfeScore: score },
    won,
  });

  /**
   * Loads the saved 2048 board or creates a new one.
   *
   * @returns the loaded board
   */
  function initializeBoard(): TTFEBoard {
    let board: TTFEBoard;

    if (!ttfeGameData || !ttfeGameData.data) {
      board = generateEmptyBoard();
    } else {
      board = (ttfeGameData.data as TTFEGameData).ttfeBoard;
    }

    return board;
  }

  function initializeScore(): number {
    const ttfeGameData = gamesData?.find(
      (data) => data.name === TTFE_GAME_NAME,
    );

    return ttfeGameData ? (ttfeGameData.data as TTFEGameData).ttfeScore : 0;
  }

  /**
   * Generates an empty 2048 game board.
   *
   * @returns an empty 2048 game board
   */
  function generateEmptyBoard(): TTFEBoard {
    const board = Array(BOARD_DIMENSIONS)
      .fill(null)
      .map(() => Array(BOARD_DIMENSIONS).fill(0));
    addNewTile(board);
    addNewTile(board);

    return board;
  }

  /**
   * Adds a new tile to the board.
   */
  function addNewTile(board: TTFEBoard): void {
    const emptyCells = [];
    for (let i = 0; i < BOARD_DIMENSIONS; i++) {
      for (let j = 0; j < BOARD_DIMENSIONS; j++) {
        if (board[i][j] === 0) {
          emptyCells.push({ i, j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { i, j } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  const moveTiles = useCallback(
    (direction: Direction) => {
      if (gameOver || won) return

      const isHorizontalMove = direction !== 'up' && direction !== 'down'
      let newBoard = board.map((row) => [...row])
      let newScore = score
      let moved = false
      let moveWon = false

      for (let i = 0; i < newBoard.length; i++) {
        let moveStatus: BoardMoveStatus

        // update board row/column depending on move direction
        if (isHorizontalMove) {
          moveStatus = performRowMove(newBoard[i], direction)
          newBoard[i] = moveStatus.updatedRow
        } else {
          moveStatus = performRowMove(getMatrixColumn(newBoard, i), direction)
          setMatrixColumn(newBoard, moveStatus.updatedRow, i)
        }

        // update common fields
        newScore += moveStatus.moveScore
        if (moveStatus.moved) {
          moved = true
        }
        if (moveStatus.moveWon) {
          moveWon = true
          break
        }
      }

      // if board moved
      if (moved) {
        addNewTile(newBoard)
        setBoard(newBoard)
        setScore(newScore)
        if (moveWon && !ttfeGameData?.won) {
          const userSettings = getSettings();
          if (userSettings.general.enableOnlineFeatures) {
            const currentDate = new Date();
            const userData = getStorageUserData();
            emptyDateTime(currentDate);
            addUserGameRegistration({
              gameName: TTFE_GAME_NAME,
              registrationDate: currentDate.valueOf(),
              userId: userData.userId,
            });
          }
          setWon(true);
        } else if (!canMove(newBoard)) {
          setGameOver(true);
        }
      }
    }, [board, gameOver, score],
  )

  /**
   * Performs the move of the given row.
   * 
   * @param row the row in which perform the move 
   * @param direction the move direction 
   * @returns the move status
   */
  function performRowMove(row: number[], direction: Direction): BoardMoveStatus {
    const positive = direction == 'down' || direction == 'right'
    let updatedRow = row.filter(value => value > 0)
    const moveStatus = {
      updatedRow: row,
      moveScore: 0,
      moved: false,
      moveWon: false
    }

    if (updatedRow.length > 0) {
      for (let i = 1; i < updatedRow.length; i++) {
        if (updatedRow[i] === updatedRow[i - 1]) {
          // update cell value
          updatedRow[i] *= 2
          // update score and check if won
          moveStatus.moveScore += updatedRow[i]
          if (updatedRow[i] >= 2048) {
            moveStatus.moveWon = true
          }
          // remove previous cell from array
          updatedRow.splice(i - 1, 1)
        }
      }

      // fill remaining with 0s
      // if positive, fill with 0s the left
      // else, fill with 0s the right
      if (positive) {
        updatedRow = [...Array(BOARD_DIMENSIONS - updatedRow.length).fill(0), ...updatedRow]
      } else {
        updatedRow = [...updatedRow, ...Array(BOARD_DIMENSIONS - updatedRow.length).fill(0)]
      }

      moveStatus.updatedRow = updatedRow
      moveStatus.moved = row !== updatedRow
    }

    return moveStatus
  }

  /**
   * Checks if a move can be made in the active board.
   *
   * @returns a boolean indicating wether a move can be made
   */
  function canMove(board: TTFEBoard): boolean {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return true;
        if (
          (i < 3 && board[i + 1][j] === board[i][j]) ||
          (j < 3 && board[i][j + 1] === board[i][j])
        ) {
          return true;
        }
      }
    }
    return false;
  }

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const panGesture = Gesture.Pan()
    .onStart(() => {
      translateX.value = 0;
      translateY.value = 0;
    })
    .onEnd((event) => {
      const { translationX, translationY } = event;
      translateX.value = translationX;
      translateY.value = translationY;

      if (Math.abs(translationX) > Math.abs(translationY)) {
        if (Math.abs(translationX) > SWIPE_THRESHOLD) {
          if (translationX > 0) {
            runOnJS(moveTiles)("right");
          } else {
            runOnJS(moveTiles)("left");
          }
        }
      } else {
        if (Math.abs(translationY) > SWIPE_THRESHOLD) {
          if (translationY > 0) {
            runOnJS(moveTiles)("down");
          } else {
            runOnJS(moveTiles)("up");
          }
        }
      }
      translateX.value = 0;
      translateY.value = 0;
    });

  function getTextColor(value: number): string {
    return value <= 4 ? "#776E65" : "#F9F6F2";
  };

  function getFontSize(value: number): number {
    if (value >= 1024) return 20;
    if (value >= 100) return 24;
    return 32;
  };

  function resetGame(): void {
    setBoard(generateEmptyBoard());
    setScore(0);
    setGameOver(false);
  };

  return !won ? (
    <GestureHandlerRootView
      style={[styles.container, GENERAL_STYLES.whiteBackgroundColor]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>2048</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.board} testID="game-board">
          {board.map((row, i) => (
            <View key={i} style={styles.row}>
              {row.map((cell, j) => (
                <View
                  key={`${i} - ${j}`}
                  style={[styles.cell, { backgroundColor: colors[cell] }]}
                >
                  {cell !== 0 && (
                    <Text
                      style={[
                        styles.cellText,
                        {
                          color: getTextColor(cell),
                          fontSize: getFontSize(cell),
                        },
                      ]}
                    >
                      {cell}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </Animated.View>
      </GestureDetector>

      {gameOver && (
        <View style={styles.gameOver}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.resetButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </GestureHandlerRootView>
  ) : (
    <GameWon />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "black",
  },
  scoreContainer: {
    backgroundColor: "black",
    padding: 8,
    borderRadius: 6,
    minWidth: 100,
    alignItems: "center",
  },
  scoreLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  scoreValue: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: "#BBADA0",
    borderRadius: 6,
    padding: CELL_MARGIN,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: CELL_SIZE - CELL_MARGIN * 2,
    height: CELL_SIZE - CELL_MARGIN * 2,
    margin: CELL_MARGIN,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CDC1B4",
  },
  cellText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  gameOver: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(238, 228, 218, 0.73)",
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#776E65",
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: "black",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 3,
  },
  resetButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
