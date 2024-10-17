import {getOpenLibraryBooksBySubject} from '../services/books.services'
import {useEffect, useState} from 'react'

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
    getOpenLibraryBooksBySubject(params)
      .then(books => setOpenLibraryBooksBySubject(books))
      .catch(err => {
        console.error(err)
      })
  }, [])

  return {openLibraryBooksBySubject, setOpenLibraryBooksBySubject}
}
