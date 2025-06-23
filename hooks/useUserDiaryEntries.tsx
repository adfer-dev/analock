import { useEffect, useState } from "react";
import { getUserDiaryEntries } from "../services/diaryEntries.services";

interface UseUserDiaryEntriesResult {
  userDiaryEntries: DiaryEntry[]
  setUserDiaryEntries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>
  error: string | undefined
}

export function useUserDiaryEntries(userId: number): UseUserDiaryEntriesResult {
  const [userDiaryEntries, setUserDiaryEntries] = useState<DiaryEntry[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    getUserDiaryEntries(userId)
      .then((diaryEntries) => {
        setUserDiaryEntries(
          diaryEntries.sort(
            (a, b) =>
              b.registration.registrationDate - a.registration.registrationDate,
          ),
        );
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  return { userDiaryEntries, setUserDiaryEntries, error };
}
