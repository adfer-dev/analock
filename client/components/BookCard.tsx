import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {Button, Image, Text, TouchableOpacity} from 'react-native'

type BookStackParamList = {
  Books: undefined
  Book: {id: string}
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
        navigation.push('Book', {id})
      }}>
      {/*
        <Image
          source={{
            uri: `https://covers.openlibrary.org/b/olid/${olid}-M.jpg`,
          }}
          style={{ width: 200, height: 200 }}
        />
        */}
      <Text>{title}</Text>
      {author != undefined && <Text>{author}</Text>}
    </TouchableOpacity>
  )
}
