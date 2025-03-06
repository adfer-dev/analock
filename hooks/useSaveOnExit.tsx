import {useEffect, useState} from 'react'
import {AppState} from 'react-native'
import {
  StorageData,
  saveStorageGamesSudoku,
  saveStorageGamesTTFE,
} from '../services/storage.services'
import {SudokuGrid} from '../components/Sudoku'
import {useNavigation} from '@react-navigation/native'
import {TTFEGameData} from '../types/game'

export function useSaveOnExit(data: StorageData): void {
  const [appInBackground, setAppOnBackground] = useState<boolean>(false)
  const navigation = useNavigation()

  // hook that performs save before exiting app
  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        if (nextAppState === 'background') {
          setAppOnBackground(true)
        } else {
          setAppOnBackground(false)
        }
      },
    )
    return () => {
      appStateListener?.remove()
    }
  }, [])

  // hook to save data when user exits app
  useEffect(() => {
    if (appInBackground) {
      saveData(data)
    }
  }, [appInBackground, data])

  // hook to save data when user goes back
  useEffect(() => {
    const backNavigationListener = navigation.addListener(
      'beforeRemove',
      () => {
        saveData(data)
      },
    )

    return backNavigationListener
  }, [data, navigation])

  /**
   * Saves data to local storage depending on the given data object
   *
   * @param data the data to be saved
   */
  function saveData(data: StorageData): void {
    if (isSudokuGrid(data)) {
      saveStorageGamesSudoku(data)
    } else if (isTTFEGameData(data)) {
      saveStorageGamesTTFE(data)
    }
  }

  /**
   * Checks if the given storage data is a Sudoku grid
   *
   * @param data the given data
   * @returns a boolean indicating wether the given data is a Sudoku grid
   */
  function isSudokuGrid(data: StorageData): data is SudokuGrid {
    // Check if data is an array
    if (!Array.isArray(data)) {
      return false
    }

    // Check if every row is an array
    for (const row of data) {
      if (!Array.isArray(row)) {
        return false
      }

      // Check if every cell matches the SudokuCell structure
      for (const cell of row) {
        if (
          typeof cell !== 'object' ||
          !('value' in cell) ||
          !('editable' in cell) ||
          !('valid' in cell)
        ) {
          return false
        }

        // Check the types of the properties
        if (
          (cell.value !== null && typeof cell.value !== 'number') ||
          typeof cell.editable !== 'boolean' ||
          typeof cell.valid !== 'boolean'
        ) {
          return false
        }
      }
    }

    return true
  }

  /**
   * Checks if the given storage data is a 2048 game data.
   *
   * @param data the given data
   * @returns a boolean indicating wether the given data is a 2048 Game board
   */
  function isTTFEGameData(data: StorageData): data is TTFEGameData {
    return 'ttfeBoard' in data && 'ttfeScore' in data
  }
}
