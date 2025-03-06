export const GameDetailScreen: React.FC = ({route}) => {
  const {component} = route.params

  return component as React.JSX.Element
}

export default GameDetailScreen
