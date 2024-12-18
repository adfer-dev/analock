import {BaseScreen} from './BaseScreen'
import {BookCard} from './BookCard'
import {
  useOpenLibraryBooksBySubject,
  useOpenLibraryBooksBySubjectResult,
} from '../hooks/useOpenLibraryBooksBySubject'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import BookDetailScreen from './Book'
import {useEffect, useState} from 'react'
import {ActivityIndicator, Text, View} from 'react-native'
import {downloadAndUnzipEpub} from '../services/download.services'

const BOOKS_NUMBER = 1

const BooksScreen = () => {
  const BooksStack = createNativeStackNavigator()
  return (
    <BooksStack.Navigator initialRouteName="Books">
      <BooksStack.Screen name="Books" component={Books} />
      <BooksStack.Screen name="Book" component={BookDetailScreen} />
    </BooksStack.Navigator>
  )
}

const Books: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [downloadedBooksCount, setDownloadedBooksCount] = useState<number>(0)
  const res: useOpenLibraryBooksBySubjectResult = useOpenLibraryBooksBySubject({
    subject: 'fantasy',
    sort: 'rating desc',
    limit: BOOKS_NUMBER,
  })

  const downloadBooks = async () => {
    if (res.openLibraryBooksBySubject) {
      for (const book of res.openLibraryBooksBySubject) {
        await downloadAndUnzipEpub(book.identifier)
        setDownloadedBooksCount(downloadedBooksCount + 1)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    if (res.openLibraryBooksBySubject !== undefined && loading) {
      downloadBooks()
    }
  }, [res])

  return (
    <BaseScreen navTitle="Books">
      {loading && (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text
            style={{
              textAlign: 'center',
              color: 'black',
            }}>{`Downloading books ${downloadedBooksCount}/${BOOKS_NUMBER}`}</Text>
        </View>
      )}
      {!loading &&
        res.openLibraryBooksBySubject?.map(book => (
          <BookCard
            key={book.identifier}
            id={book.identifier}
            title={book.title}
            author={book.creator}
          />
        ))}
    </BaseScreen>
  )
}

export default BooksScreen
