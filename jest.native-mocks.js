// Mock NativeModules.SettingsManager before anything else
jest.mock('react-native/Libraries/Settings/NativeSettingsManager', () => ({
  settings: {},
  setValues: jest.fn(),
  getConstants: () => ({}),
}));

// Mock react-native-webview and its native module
jest.mock('react-native-webview', () => {
  const RealModule = jest.requireActual('react-native-webview');
  return {
    ...RealModule,
    default: (props) => null,
  };
});

jest.mock('react-native-webview/lib/NativeRNCWebViewModule', () => ({
  default: {},
}));

// Mock react-native-gesture-handler and its native module
jest.mock('react-native-gesture-handler', () => {
  const RealModule = jest.requireActual('react-native-gesture-handler');
  return {
    ...RealModule,
    Gesture: {},
    GestureDetector: (props) => props.children,
    GestureHandlerRootView: (props) => props.children,
  };
});

jest.mock('react-native-gesture-handler/lib/commonjs/RNGestureHandlerModule', () => ({
  default: {},
}));

// Mock @react-native-google-signin/google-signin and its native module
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn().mockResolvedValue({}),
    signOut: jest.fn().mockResolvedValue(undefined),
    configure: jest.fn(),
    isSignedIn: jest.fn().mockResolvedValue(false),
    getCurrentUser: jest.fn().mockResolvedValue(null),
  },
}));

jest.mock('@react-native-google-signin/google-signin/src/spec/NativeGoogleSignin', () => ({
  default: {},
})); 