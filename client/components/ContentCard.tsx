import { GENERAL_STYLES } from "@/constants/general.styles"
import { HOME_STYLES } from "@/constants/home.styles"
import { Link, Href } from "expo-router"
import { Text, View } from "react-native"

interface ContentCardProps {
  name: string
  linkPath: Href<string | object>
  Icon: React.FC
}

export const ContentCard: React.FC<ContentCardProps> = ({
  name,
  linkPath,
  Icon,
}: ContentCardProps) => {
  return (
    <View style={[HOME_STYLES.contentCard]}>
      <Link href={linkPath}>
        <View style={[GENERAL_STYLES.flexCol, GENERAL_STYLES.flexGap]}>
          <Icon />
          <Text>{name}</Text>
        </View>
      </Link>
    </View>
  )
}
