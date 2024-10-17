import {ReactNode} from 'react'
import {View} from 'react-native'
import {GENERAL_STYLES} from '../constants/general.styles'

interface BaseScreenProps {
  navTitle?: string
  children: ReactNode
}

export const BaseScreen: React.FC<BaseScreenProps> = ({
  children,
}: BaseScreenProps) => {
  return (
    <View style={[GENERAL_STYLES.flexCol]}>
      <View style={[GENERAL_STYLES.horizontalPadding]}>{children}</View>
    </View>
  )
}
