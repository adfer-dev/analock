import { Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { GENERAL_STYLES } from "../constants/general.styles";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

export const NavigationHeader: React.FC<NativeStackHeaderProps> = ({ options, route, navigation }) => {
    const title =
        options.headerTitle !== undefined
            ? options.headerTitle.toString()
            : options.title !== undefined
                ? options.title
                : route.name
    return (
        <View
            style={[GENERAL_STYLES.whiteBackgroundColor]}
        >
            <View
                style={[GENERAL_STYLES.navigationHeader, GENERAL_STYLES.grayBackgroundColor, GENERAL_STYLES.justifyCenter]}
            >
                <View style={[GENERAL_STYLES.navigationHeaderSideBalanceSpace, GENERAL_STYLES.alignStart]}>
                    <Pressable
                        hitSlop={10}
                        onPressIn={() => {
                            navigation.goBack()
                        }}
                    >
                        <Svg width="17" height="16" viewBox="0 0 17 16" fill="none">
                            <Path
                                d="M7.75 15.5781L0.171875 8L7.75 0.421875L9.35938 2.01562L4.53906 6.83594H16.25V9.16406H4.53906L9.35938 13.9766L7.75 15.5781Z"
                                fill="#E5E1DE"
                            />
                        </Svg>
                    </Pressable>
                </View>
                <View style={[GENERAL_STYLES.flexGrow, GENERAL_STYLES.alignCenter, GENERAL_STYLES.justifyCenter]}>
                    <Text
                        numberOfLines={1}
                        style={[GENERAL_STYLES.navBar, GENERAL_STYLES.textWhite]}
                    >
                        {title}
                    </Text>
                </View>
                <View style={[GENERAL_STYLES.navigationHeaderSideBalanceSpace]}></View>
            </View>
        </View>
    )
}