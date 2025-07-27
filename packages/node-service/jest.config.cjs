module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          moduleResolution: 'node16',
          isolatedModules: true,
        },
      },
    ],
  },
  testMatch: ['**/*.spec.ts'],
  collectCoverage: false,
  injectGlobals: true,
  moduleFileExtensions: ['js', 'ts', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
}
