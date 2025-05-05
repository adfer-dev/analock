import { useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import {
  StorageData,
  getStorageBooks,
  saveGamesData,
  setSettings,
  setStorageBookData,
} from "../services/storage.services";
import { useNavigation } from "@react-navigation/native";
import { GamesData } from "../types/game";
import { SettingsContext } from "../contexts/settingsContext";

export function useSaveOnExit(data: StorageData): void {
  const [appInBackground, setAppOnBackground] = useState<boolean>(false);
  const navigation = useNavigation();
  const settingsContext = useContext(SettingsContext);

  // hook that performs save before exiting app
  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "background") {
          setAppOnBackground(true);
        } else {
          setAppOnBackground(false);
        }
      },
    );
    return () => {
      appStateListener?.remove();
    };
  }, []);

  // hook to save data when user exits app
  useEffect(() => {
    if (appInBackground) {
      saveData(data);
    }
  }, [appInBackground, data]);

  // hook to save data when user goes back
  useEffect(() => {
    const backNavigationListener = navigation.addListener(
      "beforeRemove",
      () => {
        saveData(data);
      },
    );

    return backNavigationListener;
  }, [data, navigation]);

  /**
   * Saves data to local storage depending on the given data object
   *
   * @param data the data to be saved
   */
  function saveData(data: StorageData): void {
    if ("bookId" in data && "currentPage" in data) {
      const currentBookData = getStorageBooks();

      if (currentBookData) {
        const indexToUpdate = currentBookData.findIndex(
          (bookData) => bookData.id === data.bookId,
        );
        currentBookData[indexToUpdate].data.currentPage = data.currentPage;
        currentBookData[indexToUpdate].data.finished = data.finished;
        setStorageBookData(currentBookData);
      }
    } else if ("general" in data && "bookReader" in data) {
      setSettings(data as SettingsData);
      settingsContext?.setSettings(data as SettingsData);
    } else {
      saveGamesData(data as GamesData);
    }
  }
}
