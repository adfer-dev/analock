import { useEffect } from "react";
import {
  deleteSelectedBooks,
  deleteStorageBookData,
  deleteStorageGamesData,
  getStorageUserData,
  setStorageUserData,
} from "../services/storage.services";
import {
  areDatesEqual,
  getWeekOfYear,
  timestampToDate,
} from "../utils/date.utils";

// hook to handle daily and weekly content wipes
export function useWipePeriodicContent(): boolean {
  let dailyWipe = false;
  let weeklyWipe = false;

  useEffect(() => {
    const userData = getStorageUserData();
    const currentDate: Date = new Date();
    const currentWeek = getWeekOfYear(currentDate);

    // if user opened app on a different day than previous, reset daily progress.
    if (userData.lastOpenedAppDate) {
      const lastDate: Date = timestampToDate(userData.lastOpenedAppDate);

      // execute daily wipe
      if (!areDatesEqual(lastDate, currentDate)) {
        // wipe daily content
        dailyWipe = true;
      }

      console.log(`last used app date: ${lastDate}, 
                        current date: ${currentDate}`);
    }

    // if user opened app on a diferent week than previous time, reset weekly progress.
    if (
      userData.lastOpenedAppWeek &&
      userData.lastOpenedAppWeek !== currentWeek
    ) {
      weeklyWipe = true;
    }

    console.log(`last used app week: ${userData.lastOpenedAppWeek}, 
                current date app week: ${getWeekOfYear(currentDate)}`);
    // set last oppened date
    userData.lastOpenedAppDate = currentDate.valueOf();
    // update last oppened date
    userData.lastOpenedAppWeek = currentWeek;
    setStorageUserData(userData);

    if (dailyWipe) {
      console.log("performing daily wipe...");
      deleteStorageBookData();
      deleteStorageGamesData();
    }

    if (weeklyWipe) {
      console.log("performing weekly wipe");
      deleteSelectedBooks();
    }
  }, []);
  return dailyWipe || weeklyWipe;
}
