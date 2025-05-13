import { useContext, useEffect, useState } from "react";
import {
  ActivityRegistration,
  getUserRegistrations,
} from "../services/activityRegistrations.services";
import { SettingsContext } from "../contexts/settingsContext";

interface GetUserActivityRegistrationsResponse {
  userRegistrations: ActivityRegistration[];
  error: boolean;
}

export function useGetUserActivityRegistrations(
  userId: number,
  startDate?: number,
  endDate?: number,
): GetUserActivityRegistrationsResponse {
  const [userRegistrations, setUserRegistrations] = useState<
    ActivityRegistration[]
  >([]);
  const [error, setError] = useState<boolean>(false);
  const settings = useContext(SettingsContext)?.settings;

  useEffect(() => {
    if (settings?.general.enableOnlineFeatures) {
      getUserRegistrations(userId, startDate, endDate)
        .then((registrations) => {
          setUserRegistrations(registrations);
        })
        .catch(() => setError(true));
    }
  }, []);

  return { userRegistrations, error };
}
