// Mock react-native-zip-archive
jest.mock('react-native-zip-archive', () => ({
  unzip: jest.fn().mockResolvedValue(undefined),
  zip: jest.fn().mockResolvedValue(undefined),
}));

// Mock react-native-fs
jest.mock('react-native-fs', () => ({
  ExternalDirectoryPath: '/mock/external/directory',
  exists: jest.fn().mockResolvedValue(false),
  unlink: jest.fn().mockResolvedValue(undefined),
  mkdir: jest.fn().mockResolvedValue(undefined),
  readFile: jest.fn().mockResolvedValue(''),
  writeFile: jest.fn().mockResolvedValue(undefined),
}));

// Mock react-native-mmkv
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    getString: jest.fn().mockReturnValue(undefined),
    set: jest.fn(),
    delete: jest.fn(),
  })),
  Mode: {
    SINGLE_PROCESS: 'single_process',
  },
}));

// Mock react-native-localize
jest.mock('react-native-localize', () => ({
  getLocales: jest.fn().mockReturnValue([
    {
      countryCode: 'US',
      languageTag: 'en-US',
      languageCode: 'en',
      isRTL: false,
    },
  ]),
}));

// Mock native modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    NativeModules: {
      ...RN.NativeModules,
      BackgroundDownloadModule: {
        startDownload: jest.fn().mockResolvedValue('/mock/downloaded/file.epub'),
      },
      SettingsManager: {
        settings: {},
        setValues: jest.fn(),
      },
    },
  };
}); 