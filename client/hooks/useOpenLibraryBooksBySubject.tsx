import {getOpenLibraryBooksBySubject} from '../services/books.services'
import {useEffect, useState} from 'react'
import RNFS from 'react-native-fs'

export interface useOpenLibraryBooksBySubjectResult {
  openLibraryBooksBySubject: InternetArchiveBook[] | undefined
  setOpenLibraryBooksBySubject: React.Dispatch<
    React.SetStateAction<InternetArchiveBook[] | undefined>
  >
}

export function useOpenLibraryBooksBySubject(
  params: OpenLibraryRequest,
): useOpenLibraryBooksBySubjectResult {
  const [openLibraryBooksBySubject, setOpenLibraryBooksBySubject] =
    useState<InternetArchiveBook[]>()
  const downloadPath = `${RNFS.DocumentDirectoryPath}/dailyBooks.json`

  useEffect(() => {
    RNFS.exists(downloadPath)
      .then(existsLocalDailyBooks => {
        if (existsLocalDailyBooks) {
          RNFS.readFile(downloadPath, 'utf8').then(localBooks => {
            setOpenLibraryBooksBySubject(JSON.parse(localBooks))
          })
        } else {
          getOpenLibraryBooksBySubject(params)
            .then(books => {
              RNFS.writeFile(downloadPath, JSON.stringify(books), 'utf8')
                .then(() => setOpenLibraryBooksBySubject(books))
                .catch(err => console.error(err))
            })
            .catch(err => {
              console.error(err)
            })
        }
      })
      .catch(err => console.error(err))
  }, [])

  return {openLibraryBooksBySubject, setOpenLibraryBooksBySubject}
}
