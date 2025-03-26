import axios from "axios";
import { getIntervalUserDiaryEntries } from "./diaryEntries.services";

export type ActivityRegistration =
  | BookRegistration
  | GameRegistration
  | DiaryEntry;

/**
 * Gets user book registrations in a date interval.
 *
 * @param userId the user identifier
 * @param the start date of the interval
 * @returns the user registrations
 */
async function getUserBookRegistrations(
  userId: number,
  startDate: number,
  endDate: number,
): Promise<BookRegistration[]> {
  const requestUrl = `http://localhost:3000/api/v1/activityRegistrations/books/user/${userId}?start_date=${startDate}&end_date=${endDate}`;
  let registrations: BookRegistration[] = [];
  try {
    const response = await axios.get(requestUrl);

    if (response.status === 200) {
      registrations = response.data as BookRegistration[];
    }
  } catch (err) {
    console.error(err);
  }

  return registrations;
}

/**
 * Gets user game registrations in a date interval.
 *
 * @param userId the user identifier
 * @param the start date of the interval
 * @returns the user registrations
 */
async function getUserGameRegistrations(
  userId: number,
  startDate: number,
  endDate: number,
): Promise<GameRegistration[]> {
  const requestUrl = `http://localhost:3000/api/v1/activityRegistrations/games/user/${userId}?start_date=${startDate}&end_date=${endDate}`;
  let registrations: GameRegistration[] = [];
  try {
    const response = await axios.get(requestUrl);

    if (response.status === 200) {
      registrations = response.data as GameRegistration[];
    }
  } catch (err) {
    console.error(err);
  }

  return registrations;
}

/**
 * Gets all user registrations in a date interval.
 *
 * @param userId the user identifier
 * @param the start date of the interval
 * @returns the user registrations
 */
export async function getUserRegistrations(
  userId: number,
  startDate: number,
  endDate: number,
): Promise<ActivityRegistration[]> {
  const registrations: ActivityRegistration[] = [];
  try {
    const bookRegistrations = await getUserBookRegistrations(
      userId,
      startDate,
      endDate,
    );

    const gameRegistrations = await getUserGameRegistrations(
      userId,
      startDate,
      endDate,
    );

    const diaryEntries = await getIntervalUserDiaryEntries(
      userId,
      startDate,
      endDate,
    );

    registrations.push(
      ...bookRegistrations,
      ...gameRegistrations,
      ...diaryEntries,
    );
  } catch (err) {
    console.error(err);
  }

  return registrations;
}

export async function addUserBookRegistration(
  request: AddBookRegistrationRequest,
): Promise<void> {
  const requestUrl = "http://localhost:3000/api/v1/activityRegistrations/books";

  try {
    const response = await axios.post(requestUrl, request);

    if (response.status !== 200) {
      console.error(response.data);
    }
  } catch (err) {
    console.log(err);
  }
}

export async function addUserGameRegistration(
  request: AddGameRegistrationRequest,
): Promise<void> {
  const requestUrl = "http://localhost:3000/api/v1/activityRegistrations/games";

  try {
    const response = await axios.post(requestUrl, request);

    if (response.status !== 200) {
      console.error(response.data);
    }
  } catch (err) {
    console.log(err);
  }
}
