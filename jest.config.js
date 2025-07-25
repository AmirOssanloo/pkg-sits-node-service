module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
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
    '^@sits/(.*)$': '<rootDir>/packages/$1/src'
  },
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
}