import { ReactNode } from 'react'
import { NavBar } from './NavBar'
import { View } from 'react-native'
import { GENERAL_STYLES } from '@/constants/general.styles'

interface BaseScreenProps {
  navTitle?: string
  children: ReactNode
}

export const BaseScreen: React.FC<BaseScreenProps> = ({
  navTitle: title,
  children,
}: BaseScreenProps) => {
  return (
    <View style={[GENERAL_STYLES.flexCol]}>
      <NavBar title={title} />
      {children}
    </View>
  )
}
