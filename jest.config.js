/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  roots: ['<rootDir>/packages', '<rootDir>/src'],
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    'src/**/*.ts',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/**/*.spec.ts',
    '!packages/*/dist/**'
  ],
  modulePathIgnorePatterns: ['dist'],
  moduleFileExtensions: ['js', 'ts'],
  reporters: ['default', 'jest-junit'],
  moduleNameMapper: {
    '^@sits/(.*)$': '<rootDir>/packages/$1/src',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: {
        moduleResolution: 'node',
        allowJs: true
      }
    }
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)']
}