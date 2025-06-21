interface DiaryEntry {
  id: number;
  title: string;
  content: string;
  registration: Registration;
}

interface AddDiaryEntryRequest {
  title: string;
  content: string;
  publishDate: number;
  userId: number;
}
interface UpdateDiaryEntryRequest {
  title: string;
  content: string;
  publishDate: number;
}
