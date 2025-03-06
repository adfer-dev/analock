interface DiaryEntry {
  id: number
  title: string
  content: string
  publishDate: number
  user_id: number
}

interface AddDiaryEntryRequest {
  title: string
  content: string
  publishDate: number
  user_id: number
}
