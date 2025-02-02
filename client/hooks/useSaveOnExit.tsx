import {useEffect, useState} from 'react'
import {AppState} from 'react-native'
import {
  StorageData,
  getStorageGamesData,
  setStorageGamesData,
} from '../services/storage.services'
import {SudokuGrid} from '../components/Sudoku'

export function useSaveOnExit(data: StorageData): void {
  const [appInBackground, setAppOnBackground] = useState<boolean>(false)

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

  // hook to save sudoku progress
  useEffect(() => {
    if (appInBackground) {
      saveData(data)
    }
    return () => {
      saveData(data)
    }
  }, [appInBackground, data])

  function saveData(data: StorageData): void {
    if ('sudokuGrid' in data) {
      saveSudokuGrid(data.sudokuGrid as SudokuGrid)
    }
  }

  function saveSudokuGrid(grid: SudokuGrid): void {
    const gamesData = getStorageGamesData()
    if (gamesData) {
      gamesData.sudokuGrid = grid
      setStorageGamesData(gamesData)
    } else {
      setStorageGamesData({sudokuGrid: grid})
    }
  }
}
