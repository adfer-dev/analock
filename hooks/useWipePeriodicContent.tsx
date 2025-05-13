import { useContext, useEffect, useState } from "react";
import {
  deleteSelectedBooks,
  deleteStorageBookData,
  deleteStorageGamesData,
  getStorageUserData,
  setStorageUserData,
} from "../services/storage.services";
import {
  areDateWeeksEqual,
  areDatesEqual,
  emptyDateTime,
  timestampToDate,
} from "../utils/date.utils";
import { SettingsContext } from "../contexts/settingsContext";

// hook to handle daily and weekly content wipes
export function useWipePeriodicContent(): boolean {
  const [wiped, setWiped] = useState<boolean>(false);
  const userSettings = useContext(SettingsContext)?.settings;

  useEffect(() => {
    let dailyWipe = false;
    let weeklyWipe = false;
    const userData = getStorageUserData();
    const currentDate: Date = new Date();

    // if user opened app on a different day than previous, reset daily progress.
    if (userData.lastOpenedAppDate) {
      const lastDate: Date = timestampToDate(userData.lastOpenedAppDate);

      // execute daily wipe
      if (!areDatesEqual(lastDate, currentDate)) {
        // wipe daily content
        dailyWipe = true;
      }

      // if user opened app on a diferent week than previous time, reset weekly progress.
      if (!areDateWeeksEqual(lastDate, userSettings!)) {
        weeklyWipe = true;
      }
      console.log(`last used app date: ${lastDate}, 
                        current date: ${currentDate}`);
      if (dailyWipe) {
        console.log("performing daily wipe...");
        deleteStorageBookData();
        deleteStorageGamesData();
      }

      if (weeklyWipe) {
        console.log("performing weekly wipe...");
        deleteSelectedBooks();
      }
    }

    // set last oppened date
    userData.lastOpenedAppDate = currentDate.valueOf();
    setStorageUserData(userData);

    setWiped(dailyWipe || weeklyWipe);
  }, []);
  return wiped;
}
