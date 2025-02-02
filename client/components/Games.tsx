import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {View} from 'react-native'
import {SudokuGame} from './Sudoku'
import {GameCard} from './GameCard'
import GameDetailScreen from './Game'

const GamesScreen = () => {
  const GamesStack = createNativeStackNavigator()
  return (
    <GamesStack.Navigator initialRouteName="Games">
      <GamesStack.Screen name="Games" component={Games} />
      <GamesStack.Screen
        name="Game"
        component={GameDetailScreen}
        options={({route}) => ({
          headerTitle: route.params?.name as string,
        })}
      />
    </GamesStack.Navigator>
  )
}

interface Game {
  name: string
  component: React.JSX.Element
}

const Games: React.FC = () => {
  const games: Game[] = [
    {
      name: 'Sudoku',
      component: <SudokuGame />,
    },
  ]
  return (
    <View>
      {games.map(game => (
        <GameCard name={game.name} component={game.component} key={game.name} />
      ))}
    </View>
  )
}

export default GamesScreen
