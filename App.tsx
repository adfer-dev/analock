import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BooksScreen from "./components/Books";
import MySpaceScreen from "./components/MySpace";
import { UserDataProvider } from "./contexts/userDataContext";
import GamesScreen from "./components/Games";
import DiaryScreen from "./components/DiaryEntries";
import Home from "./components/Home";

export const navigationRef = createNavigationContainerRef();
function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();
  return (
    <UserDataProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="BooksScreen"
            component={BooksScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GamesScreen"
            component={GamesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DiaryScreen"
            component={DiaryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MySpaceScreen"
            component={MySpaceScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserDataProvider>
  );
}

export default App;
