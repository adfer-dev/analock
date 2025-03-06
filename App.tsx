import {Home} from './components/Home'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import BooksScreen from './components/Books'
import Media from './components/Media'
import {UserDataProvider} from './contexts/userDataContext'
import GamesScreen from './components/Games'
import DiaryScreen from './components/DiaryEntries'

function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator()
  return (
    <UserDataProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen
            name="BooksScreen"
            component={BooksScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MediaScreen"
            component={Media}
            options={{title: 'Media'}}
          />
          <Stack.Screen
            name="GamesScreen"
            component={GamesScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DiaryScreen"
            component={DiaryScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserDataProvider>
  )
}

export default App
