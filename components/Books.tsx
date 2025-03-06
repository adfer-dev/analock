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

const BOOKS_NUMBER = 2

const BooksScreen = () => {
  const BooksStack = createNativeStackNavigator()
  return (
    <BooksStack.Navigator initialRouteName="Books">
      <BooksStack.Screen name="Books" component={Books} />
      <BooksStack.Screen
        name="Book"
        component={BookDetailScreen}
        options={({route}) => ({
          headerTitle: route.params?.title as string,
        })}
      />
    </BooksStack.Navigator>
  )
}

const Books: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const res: useOpenLibraryBooksBySubjectResult = useOpenLibraryBooksBySubject({
    subject: 'science',
    sort: 'rating desc',
    limit: BOOKS_NUMBER,
  })

  const downloadBooks = async () => {
    if (res.openLibraryBooksBySubject) {
      for (const book of res.openLibraryBooksBySubject) {
        await downloadAndUnzipEpub(book)
        setTimeout(() => {}, 1000)
      }
    }
  }

  useEffect(() => {
    if (res.openLibraryBooksBySubject && loading) {
      downloadBooks()
        .then(() => {
          setLoading(false)
        })
        .catch(error => console.error(error))
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
            }}>
            {
              'We are downloading the required content.\nYou can minimize the app and check the progress on the notification bar.'
            }
          </Text>
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
