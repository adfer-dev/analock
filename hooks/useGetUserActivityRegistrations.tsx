import { useEffect, useState } from "react";
import {
  ActivityRegistration,
  getUserRegistrations,
} from "../services/activityRegistrations.services";

export function useGetUserActivityRegistrations(
  userId: number,
  startDate?: number,
  endDate?: number,
): ActivityRegistration[] {
  const [userRegistrations, setUserRegistrations] = useState<
    ActivityRegistration[]
  >([]);

  useEffect(() => {
    getUserRegistrations(userId, startDate, endDate)
      .then((registrations) => {
        setUserRegistrations(registrations);
      })
      .catch((err) => console.error(err));
  }, []);

  return userRegistrations;
}
