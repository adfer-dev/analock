module.exports = {
  preset: "react-native",
  setupFiles: ["<rootDir>/jest.native-mocks.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic|react-native-zip-archive|react-native-fs)",
    "jest-runner"
  ],
};
