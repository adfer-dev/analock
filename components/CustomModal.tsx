import {Modal, TouchableOpacity, View} from 'react-native'
import {G, Path, Svg} from 'react-native-svg'

interface CustomModalProps {
  visibleIndicator: boolean
  onRequestCloseHandler: () => void
  children: React.JSX.Element | React.JSX.Element[]
}

export const CustomModal: React.FC<CustomModalProps> = ({
  visibleIndicator,
  onRequestCloseHandler,
  children,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visibleIndicator}
      onRequestClose={onRequestCloseHandler}>
      <View style={[]}>
        <TouchableOpacity
          style={{marginBottom: 20}}
          onPress={onRequestCloseHandler}>
          <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
            <G id="SVGRepo_bgCarrier" strokeWidth="0" />
            <G
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <G id="SVGRepo_iconCarrier">
              <G id="Menu / Close_LG">
                <Path
                  id="Vector"
                  d="M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </G>
            </G>
          </Svg>
        </TouchableOpacity>
        {children}
      </View>
    </Modal>
  )
}
