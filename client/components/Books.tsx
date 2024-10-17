import {BaseScreen} from './BaseScreen'
import {BookCard} from './BookCard'
import {
  useOpenLibraryBooksBySubject,
  useOpenLibraryBooksBySubjectResult,
} from '../hooks/useOpenLibraryBooksBySubject'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import BookDetailScreen from './Book'

const BooksScreen = () => {
  const BooksStack = createNativeStackNavigator()
  return (
    <BooksStack.Navigator initialRouteName="Books">
      <BooksStack.Screen name="Books" component={Books} />
      <BooksStack.Screen name="Book" component={BookDetailScreen} />
    </BooksStack.Navigator>
  )
}

const Books = () => {
  const res: useOpenLibraryBooksBySubjectResult = useOpenLibraryBooksBySubject({
    subject: 'fantasy',
    sort: 'rating desc',
    limit: 4,
  })
  return (
    <BaseScreen navTitle="Books">
      {res.openLibraryBooksBySubject?.map(book => (
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
