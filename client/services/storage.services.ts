import {MMKV, Mode} from 'react-native-mmkv'
import {APP_DOCUMENTS_PATH} from './download.services'
import {REACT_APP_LOCAL_STORAGE_KEY} from '@env'

const storageInstance = new MMKV({
  id: `analock-storage`,
  path: APP_DOCUMENTS_PATH,
  encryptionKey: REACT_APP_LOCAL_STORAGE_KEY,
  mode: Mode.SINGLE_PROCESS,
})

const USER_DATA_STORAGE_KEY = 'userData'
const BOOKS_DATA_STORAGE_KEY = 'bookData'
const BOOKS_STORAGE_KEY = 'books'
const DEFAULT_USER_DATA: UserData = {
  authenticated: true,
}

// USER DATA FUNCTIONS

/**
 * Gets the locally stored user data
 *
 * @returns the stored user data or the default user data if there is no user data stored
 */
export function getStorageUserData(): UserData {
  let userData: UserData
  const userDataString = storageInstance.getString(USER_DATA_STORAGE_KEY)

  if (userDataString !== undefined) {
    userData = JSON.parse(userDataString) as UserData
    console.log(`Loaded user data: ${userDataString}`)
  } else {
    userData = DEFAULT_USER_DATA
    console.log('No user data was saved. Loading default data...')
  }

  return userData
}

/**
 * Sets the value of the locally stored user data.
 *
 * @param userData the user data to be stored
 */
export function setStorageUserData(userData: UserData): void {
  storageInstance.set(USER_DATA_STORAGE_KEY, JSON.stringify(userData))
}

// SELECTED BOOKS FUNCTIONS

/**
 * Gets the locally stored selected books for the current period.
 *
 * @returns the stored selected books
 */
export function getSelectedBooks(): InternetArchiveBook[] | undefined {
  let selectedBooks: InternetArchiveBook[] | undefined
  const selectedBooksString = storageInstance.getString(BOOKS_STORAGE_KEY)

  if (selectedBooksString) {
    selectedBooks = JSON.parse(selectedBooksString) as InternetArchiveBook[]
  }

  return selectedBooks
}

/**
 * Stores the selected books for the current period.
 *
 * @param selectedBooks the selected books to be stored
 */
export function setSelectedBooks(selectedBooks: InternetArchiveBook[]): void {
  storageInstance.set(BOOKS_STORAGE_KEY, JSON.stringify(selectedBooks))
}

/**
 * Deletes the selected books from local storage.
 */
export function deleteSelectedBooks(): void {
  storageInstance.delete(BOOKS_STORAGE_KEY)
}

// BOOK DATA FUNCTIONS

/**
 * Gets from local storage the stored book data from all books.
 *
 * @returns the stored book data or undefined, if no data was stored
 */
export function getStorageBooks(): StorageBook[] | undefined {
  let books: StorageBook[] | undefined
  const bookString = storageInstance.getString(BOOKS_DATA_STORAGE_KEY)

  if (bookString) {
    books = JSON.parse(bookString) as StorageBook[]
  }

  return books
}

/**
 * Gets from local storage the stored book data for the book whose identifier matches with the id passed by parameter.
 *
 * @param bookId the book identifier to get the book data from
 */
export function getStorageBookData(
  bookId: string,
): StorageBookData | undefined {
  let bookData: StorageBookData | undefined
  const books = getStorageBooks()

  if (books) {
    const selectedBook = books.find(selectedBook => selectedBook.id === bookId)

    if (selectedBook) {
      bookData = selectedBook.data
    }
  }

  return bookData
}

/**
 * Adds a new book data to the stored ones.
 *
 * @param book the book data to be stored
 */
export function addStorageBookData(book: StorageBook): void {
  let books = getStorageBooks()

  if (!books) {
    books = []
  }

  books.push(book)
  storageInstance.set(BOOKS_DATA_STORAGE_KEY, JSON.stringify(books))
}

/**
 * Sets the locally stored book data passed by parameter.
 *
 *@param books the book data to be stored
 */
export function setStorageBookData(books: StorageBook[]): void {
  storageInstance.set(BOOKS_DATA_STORAGE_KEY, JSON.stringify(books))
}

/**
 * Deletes all books' data from local storage
 */
export function deleteStorageBookData(): void {
  storageInstance.delete(BOOKS_DATA_STORAGE_KEY)
}
