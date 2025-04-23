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
import { getStorageGamesData } from "../services/storage.services";
import { addUserGameRegistration } from "../services/activityRegistrations.services";
import { emptyDateTime } from "../utils/date.utils";
import { SWIPE_THRESHOLD, TTFE_GAME_NAME } from "../constants/constants";
import { TTFEGameData } from "../types/game";

type Direction = "up" | "down" | "left" | "right";
export type TTFEBoard = number[][];

const { width } = Dimensions.get("window");
const BOARD_SIZE = width - 32;
const CELL_SIZE = BOARD_SIZE / 4;
const CELL_MARGIN = 4;
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
  const [board, setBoard] = useState<TTFEBoard>(() => initializeBoard());
  const [score, setScore] = useState<number>(() => initializeScore());
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
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
    const ttfeGameData = getStorageGamesData()?.find(
      (data) => data.name === TTFE_GAME_NAME,
    );
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
    const board = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));
    addNewTile(board);
    addNewTile(board);

    return board;
  }

  /**
   * Adds a new tile to the board.
   */
  function addNewTile(board: TTFEBoard): void {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
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
      if (gameOver) return;

      const newBoard = board.map((row) => [...row]);
      let moved = false;
      let newScore = score;

      const rotateBoard = (times: number) => {
        for (let t = 0; t < times; t++) {
          const rotated = Array(4)
            .fill(null)
            .map(() => Array(4).fill(0));
          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
              rotated[i][j] = newBoard[3 - j][i];
            }
          }
          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
              newBoard[i][j] = rotated[i][j];
            }
          }
        }
      };

      if (direction === "up") rotateBoard(3);
      else if (direction === "right") rotateBoard(2);
      else if (direction === "down") rotateBoard(1);

      for (let i = 0; i < 4; i++) {
        const row = newBoard[i].filter((cell) => cell !== 0);
        for (let j = 0; j < row.length - 1; j++) {
          if (row[j] === row[j + 1]) {
            row[j] *= 2;
            newScore += row[j];
            row.splice(j + 1, 1);
            moved = true;
          }
        }
        const newRow = [...row, ...Array(4 - row.length).fill(0)];
        if (newRow.join(",") !== newBoard[i].join(",")) moved = true;
        newBoard[i] = newRow;
      }

      if (direction === "up") rotateBoard(1);
      else if (direction === "right") rotateBoard(2);
      else if (direction === "down") rotateBoard(3);

      if (moved) {
        addNewTile(newBoard);
        setBoard(newBoard);
        setScore(newScore);

        if (score >= 2048) {
          const currentDate = new Date();
          emptyDateTime(currentDate);
          addUserGameRegistration({
            gameName: "2048 Game",
            registrationDate: currentDate.valueOf(),
            userId: 1,
          });
          setWon(true);
        } else if (!canMove(newBoard)) {
          setGameOver(true);
        }
      }
    },
    [board, gameOver, score],
  );

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

  const panGesture = Gesture.Pan().onEnd((event) => {
    const { translationX, translationY } = event;

    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (Math.abs(translationX) > SWIPE_THRESHOLD) {
        if (translationX > 0) {
          moveTiles("right");
        } else {
          moveTiles("left");
        }
      }
    } else {
      if (Math.abs(translationY) > SWIPE_THRESHOLD) {
        if (translationY > 0) {
          moveTiles("down");
        } else {
          moveTiles("up");
        }
      }
    }
  });

  const getTextColor = (value: number): string => {
    return value <= 4 ? "#776E65" : "#F9F6F2";
  };

  const getFontSize = (value: number): number => {
    if (value >= 1024) return 20;
    if (value >= 100) return 24;
    return 32;
  };

  const resetGame = () => {
    setBoard(generateEmptyBoard());
    setScore(0);
    setGameOver(false);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>2048</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
      </View>

      <GestureDetector gesture={panGesture}>
        <View style={styles.board}>
          {board.map((row, i) => (
            <View key={i} style={styles.row}>
              {row.map((cell, j) => (
                <View
                  key={`${i}-${j}`}
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
        </View>
      </GestureDetector>

      {gameOver && (
        <View style={styles.gameOver}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.resetButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
      {won && (
        <View>
          <Text>{`You won the game! Score: ${score}`}</Text>
        </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8EF",
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
    color: "#776E65",
  },
  scoreContainer: {
    backgroundColor: "#BBADA0",
    padding: 8,
    borderRadius: 6,
    minWidth: 100,
    alignItems: "center",
  },
  scoreLabel: {
    color: "#EEE4DA",
    fontSize: 16,
    fontWeight: "bold",
  },
  scoreValue: {
    color: "#FFFFFF",
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
    backgroundColor: "#8F7A66",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 3,
  },
  resetButtonText: {
    color: "#F9F6F2",
    fontSize: 18,
    fontWeight: "bold",
  },
});
