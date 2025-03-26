import { useEffect, useState } from "react";
import { getUserBookRegistrations } from "../services/activityRegistrations.services";

export function useUserBookRegistrations(
  userId: number,
  startDate: number,
  endDate: number,
) {
  const [userBookRegistrations, setUserBookRegistrations] = useState<
    BookRegistration[]
  >([]);

  useEffect(() => {
    getUserBookRegistrations(userId, startDate, endDate)
      .then((bookRegistrations) => {
        setUserBookRegistrations(bookRegistrations);
      })
      .catch((err) => console.error(err));
  }, []);

  return userBookRegistrations;
}
