import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {Text} from 'react-native-svg'
import {TouchableOpacity} from 'react-native/types'

interface DiaryEntryCardProps {
  title: string
  content: string
  publishDate: string
}
type DiaryEntryStackParamList = {
  DiaryEntries: undefined
  DiaryEntry: DiaryEntryCardProps
}

export const GameCard: React.FC<DiaryEntryCardProps> = ({
  title,
  content,
  publishDate,
}) => {
  const navigation: NativeStackNavigationProp<DiaryEntryStackParamList> =
    useNavigation()
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push('DiaryEntry', {title, content, publishDate})
      }}>
      <Text>{title}</Text>
      <Text>{publishDate}</Text>
    </TouchableOpacity>
  )
}
