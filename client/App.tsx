import {Home} from './components/Home'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import BooksScreen from './components/Books'
import Media from './components/Media'
import Diary from './components/Diary'

function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator()
  return (
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
          name="DiaryScreen"
          component={Diary}
          options={{title: 'Diary'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
