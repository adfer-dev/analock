import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {Text, TouchableOpacity} from 'react-native'
import {BooksIcon} from './BooksIcon'

type BookStackParamList = {
  Books: undefined
  Book: {id: string; title: string}
}

interface BookCardProps {
  id: string
  title: string
  author?: string
}

export const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
}: BookCardProps) => {
  const navigation: NativeStackNavigationProp<BookStackParamList> =
    useNavigation()
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push('Book', {id, title})
      }}>
      <BooksIcon />
      <Text>{title}</Text>
      {author != undefined && <Text>{author}</Text>}
    </TouchableOpacity>
  )
}
