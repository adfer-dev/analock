import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {TouchableOpacity} from 'react-native'
import {GamesIcon} from './GamesIcon'
import {Text} from 'react-native'

interface GameCardProps {
  name: string
  component: React.JSX.Element
}

type GameStackParamList = {
  Games: undefined
  Game: {name: string; component: React.JSX.Element}
}

export const GameCard: React.FC<GameCardProps> = ({name, component}) => {
  const navigation: NativeStackNavigationProp<GameStackParamList> =
    useNavigation()
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push('Game', {name, component})
      }}>
      <GamesIcon />
      <Text>{name}</Text>
    </TouchableOpacity>
  )
}
