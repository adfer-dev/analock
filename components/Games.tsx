import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SudokuGame } from "./Sudoku";
import { GameCard } from "./GameCard";
import GameDetailScreen from "./Game";
import { Game2048 } from "./2048Game";

import { generalOptions } from "./Home";
import { BaseScreen } from "./BaseScreen";
import { useContext } from "react";
import { TranslationsContext } from "../contexts/translationsContext";

const GamesScreen = () => {
  const GamesStack = createNativeStackNavigator();
  const translations = useContext(TranslationsContext)?.translations;
  return (
    <GamesStack.Navigator initialRouteName="Games">
      <GamesStack.Screen
        name="Games"
        component={Games}
        options={{ ...generalOptions, headerTitle: translations?.home.games }}
      />
      <GamesStack.Screen
        name="Game"
        component={GameDetailScreen}
        options={({ route }) => ({
          ...generalOptions,
          headerTitle: route.params?.name as string,
        })}
      />
    </GamesStack.Navigator>
  );
};

interface Game {
  name: string;
  component: React.JSX.Element;
}

const Games: React.FC = () => {
  const games: Game[] = [
    {
      name: "Sudoku",
      component: <SudokuGame />,
    },
    {
      name: "2048",
      component: <Game2048 />,
    },
  ];
  return (
    <BaseScreen>
      {games.map((game) => (
        <GameCard name={game.name} component={game.component} key={game.name} />
      ))}
    </BaseScreen>
  );
};

export default GamesScreen;
