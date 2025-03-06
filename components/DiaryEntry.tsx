import {View} from 'react-native'
import {Text} from 'react-native-svg'

const DiaryEntryDetailScreen: React.FC = ({route}) => {
  const {title, content, publishDate} = route.params

  return (
    <View>
      <Text>{title}</Text>
      <Text>{publishDate}</Text>
      <Text>{content}</Text>
    </View>
  )
}

export default DiaryEntryDetailScreen
