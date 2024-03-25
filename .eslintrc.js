module.exports = {
  root: true,
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:security/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['import', 'jest', 'node', 'prettier', 'security', 'standard'],
  rules: {
    'import/order': [
      'warn',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'never',
      },
    ],

    // Typescript specific
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    // Eslint rules
    'prettier/prettier': 'error',
    'security/detect-non-literal-fs-filename': 'off',
    'security/detect-object-injection': 'off',
  },
  overrides: [
    {
      files: ['**/*.js'],
      rules: {},
    },
    {
      files: ['**/*.spec.js'],
      rules: {},
    },
    {
      files: ['**/*.ts'],
      rules: {},
    },
    {
      files: ['**/*.spec.ts'],
      rules: {},
    },
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
}
