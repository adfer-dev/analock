import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {Image, Text, TouchableOpacity} from 'react-native'
import {APP_DOCUMENTS_PATH} from '../services/download.services'

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
            uri: `file://${APP_DOCUMENTS_PATH}/${id}/cover.jpg`,
          }}
          style={{width: 200, height: 200}}
        />
        */}
      <Text>{title}</Text>
      {author != undefined && <Text>{author}</Text>}
    </TouchableOpacity>
  )
}
