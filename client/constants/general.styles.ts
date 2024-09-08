import { StyleSheet } from 'react-native'

export const GENERAL_STYLES = StyleSheet.create({
  generalPadding: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  flexGap: {
    gap: 10,
  },
  textCenter: {
    textAlign: 'center',
  },
  flexGrow: {
    flex: 1,
  },
  title: {
    fontSize: 22,
  },
  navBar: {
    paddingHorizontal: 10,
    marginBottom: 20,
    height: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})
