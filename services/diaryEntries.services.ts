import axios from 'axios'

export async function getUserDiaryEntries(
  userId: number,
): Promise<DiaryEntry[]> {
  const getDiaryEntriesUrl = `http://localhost:3000/api/v1/diaryEntries/user/${userId}`
  let userDiaryEntries: DiaryEntry[] = []

  try {
    const userDiaryEntriesResponse = await axios({
      url: getDiaryEntriesUrl,
      method: 'GET',
      responseType: 'json',
    })

    userDiaryEntries = userDiaryEntriesResponse.data as DiaryEntry[]
  } catch (error) {
    console.error(error)
  }

  return userDiaryEntries
}

export async function addUserDiaryEntry(
  diaryEntry: AddDiaryEntryRequest,
): Promise<DiaryEntry | undefined> {
  const addDiaryEntryUrl = `http://localhost:3000/api/v1/diaryEntries`
  let userDiaryEntry: DiaryEntry | undefined

  try {
    const userDiaryEntriesResponse = await axios.post(
      addDiaryEntryUrl,
      diaryEntry,
    )

    userDiaryEntry = userDiaryEntriesResponse.data as DiaryEntry
  } catch (error) {
    console.error(error)
  }

  return userDiaryEntry
}
