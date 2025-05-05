import { getOpenLibraryBooksBySubject } from "../services/books.services";
import { useEffect, useState } from "react";
import {
  getSelectedBooks,
  setSelectedBooks,
} from "../services/storage.services";

export interface useOpenLibraryBooksBySubjectResult {
  openLibraryBooksBySubject: InternetArchiveBook[] | undefined;
  setOpenLibraryBooksBySubject: React.Dispatch<
    React.SetStateAction<InternetArchiveBook[] | undefined>
  >;
  error: string | undefined;
}

export function useOpenLibraryBooksBySubject(
  params: OpenLibraryRequest,
): useOpenLibraryBooksBySubjectResult {
  const [openLibraryBooksBySubject, setOpenLibraryBooksBySubject] =
    useState<InternetArchiveBook[]>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const selectedBooks = getSelectedBooks();

    if (selectedBooks) {
      setOpenLibraryBooksBySubject(selectedBooks);
    } else {
      getOpenLibraryBooksBySubject(params)
        .then((books) => {
          setOpenLibraryBooksBySubject(books);
          setSelectedBooks(books);
        })
        .catch((error) => setError(error));
    }
  }, []);

  return { openLibraryBooksBySubject, setOpenLibraryBooksBySubject, error };
}
