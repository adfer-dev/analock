import {Home} from './components/Home'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import BooksScreen from './components/Books'
import Media from './components/Media'

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
        <Stack.Screen name="MediaScreen" component={Media} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
