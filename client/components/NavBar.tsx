import { Text, View } from 'react-native'
import { BackIcon } from './BackIcon'
import { GENERAL_STYLES } from '@/constants/general.styles'
import { Link } from 'expo-router'

interface NavBarProps {
  title?: string
}

export const NavBar: React.FC<NavBarProps> = ({ title }: NavBarProps) => {
  return (
    <View style={[GENERAL_STYLES.navBar]}>
      <Link href="/">
        <BackIcon />
      </Link>
      <Text
        style={[
          GENERAL_STYLES.textCenter,
          GENERAL_STYLES.flexGrow,
          GENERAL_STYLES.title,
        ]}
      >
        {title}
      </Text>
    </View>
  )
}
