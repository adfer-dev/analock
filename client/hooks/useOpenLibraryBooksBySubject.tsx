import {getOpenLibraryBooksBySubject} from '../services/books.services'
import {useEffect, useState} from 'react'
import {getSelectedBooks, setSelectedBooks} from '../services/storage.services'

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

  useEffect(() => {
    const selectedBooks = getSelectedBooks()

    if (selectedBooks) {
      setOpenLibraryBooksBySubject(selectedBooks)
    } else {
      getOpenLibraryBooksBySubject(params)
        .then(books => {
          setSelectedBooks(books)
          setOpenLibraryBooksBySubject(books)
        })
        .catch(error =>
          console.error(
            `Error retrieving books from open library API: ${error}`,
          ),
        )
    }
  }, [])

  return {openLibraryBooksBySubject, setOpenLibraryBooksBySubject}
}
