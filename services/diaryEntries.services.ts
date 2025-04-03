import { AXIOS_INSTANCE } from "./interceptors";

export async function getUserDiaryEntries(
  userId: number,
): Promise<DiaryEntry[]> {
  const getDiaryEntriesUrl = `http://localhost:3000/api/v1/diaryEntries/user/${userId}`;
  let userDiaryEntries: DiaryEntry[] = [];

  const userDiaryEntriesResponse = await AXIOS_INSTANCE.get(getDiaryEntriesUrl);

  if (userDiaryEntriesResponse.status === 200) {
    userDiaryEntries = userDiaryEntriesResponse.data as DiaryEntry[];
  }

  return userDiaryEntries;
}

export async function getIntervalUserDiaryEntries(
  userId: number,
  startDate: number,
  endDate: number,
): Promise<DiaryEntry[]> {
  const getDiaryEntriesUrl = `${process.env.API_ROOT_URL}api/v1/diaryEntries/user/${userId}?start_date=${startDate}&end_date=${endDate}`;
  let userDiaryEntries: DiaryEntry[] = [];

  try {
    const userDiaryEntriesResponse =
      await AXIOS_INSTANCE.get(getDiaryEntriesUrl);

    userDiaryEntries = userDiaryEntriesResponse.data as DiaryEntry[];
  } catch (error) {
    console.error(error);
  }

  return userDiaryEntries;
}

export async function addUserDiaryEntry(
  diaryEntry: AddDiaryEntryRequest,
): Promise<DiaryEntry | undefined> {
  const addDiaryEntryUrl = `${process.env.API_ROOT_URL}api/v1/diaryEntries`;
  let userDiaryEntry: DiaryEntry | undefined;

  try {
    const userDiaryEntriesResponse = await AXIOS_INSTANCE.post(
      addDiaryEntryUrl,
      diaryEntry,
    );

    userDiaryEntry = userDiaryEntriesResponse.data as DiaryEntry;
  } catch (error) {
    console.error(error);
  }

  return userDiaryEntry;
}

export async function updateUserDiaryEntry(
  diaryEntryId: number,
  diaryEntry: UpdateDiaryEntryRequest,
): Promise<DiaryEntry | undefined> {
  const addDiaryEntryUrl = `${process.env.API_ROOT_URL}api/v1/diaryEntries/${diaryEntryId}`;
  let userDiaryEntry: DiaryEntry | undefined;

  try {
    const userDiaryEntriesResponse = await AXIOS_INSTANCE.put(
      addDiaryEntryUrl,
      diaryEntry,
    );

    userDiaryEntry = userDiaryEntriesResponse.data as DiaryEntry;
  } catch (error) {
    console.error(error);
  }

  return userDiaryEntry;
}
