import {useEffect} from 'react'
import {
  deleteSelectedBooks,
  deleteStorageBookData,
  deleteStorageGamesData,
  getStorageUserData,
  setStorageUserData,
} from '../services/storage.services'
import {areDatesEqual, getWeekOfYear} from '../utils/date.utils'

// hook to handle dialy and weekly content wipes
export function useWipePeriodicContent() {
  useEffect(() => {
    const userData = getStorageUserData()
    const currentDate: Date = new Date()
    const currentWeek = getWeekOfYear(currentDate)

    // if user opened app on a different day than previous, reset daily progress.
    if (userData.lastOpenedAppDate) {
      const lastDate: Date = new Date(userData.lastOpenedAppDate)

      // execute daily wipe
      if (!areDatesEqual(lastDate, currentDate)) {
        // wipe daily content
        deleteStorageBookData()
        deleteStorageGamesData()
        // update last oppened date
        userData.lastOpenedAppDate = new Date().toString()
        setStorageUserData(userData)
        console.log('performing daily wipe...')
      }

      console.log(`last used app date: ${lastDate}, 
                        current date: ${currentDate}`)
    } else {
      // set last oppened date
      userData.lastOpenedAppDate = new Date().toString()
      setStorageUserData(userData)
    }

    // if user opened app on a diferent week than previous time, reset weekly progress.
    if (userData.lastOpenedAppWeek) {
      if (userData.lastOpenedAppWeek !== currentWeek) {
        deleteSelectedBooks()
        // update last oppened date
        userData.lastOpenedAppWeek = currentWeek
        setStorageUserData(userData)
      }
      console.log(`last used app week: ${userData.lastOpenedAppWeek}, 
                        current date app week: ${getWeekOfYear(currentDate)}`)
    } else {
      // set last oppened week
      userData.lastOpenedAppWeek = currentWeek
      setStorageUserData(userData)
    }
  }, [])
}
