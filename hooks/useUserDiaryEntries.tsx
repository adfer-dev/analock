import { useEffect, useState } from "react";
import { getUserDiaryEntries } from "../services/diaryEntries.services";

export function useUserDiaryEntries(userId: number) {
  const [userDiaryEntries, setUserDiaryEntries] = useState<DiaryEntry[]>();

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
        console.error(error);
      });
  }, []);

  return { userDiaryEntries, setUserDiaryEntries };
}
