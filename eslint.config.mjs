import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import jestPlugin from 'eslint-plugin-jest'
import nodePlugin from 'eslint-plugin-node'
import prettierPlugin from 'eslint-plugin-prettier'
import promisePlugin from 'eslint-plugin-promise'
import securityPlugin from 'eslint-plugin-security'

export default [
  ...js.configs.recommended,
  ...tseslint.configs.recommended,
  ...prettierConfig,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
      jest: jestPlugin,
      node: nodePlugin,
      prettier: prettierPlugin,
      promise: promisePlugin,
      security: securityPlugin,
    },
  },
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/generated/**',
      '**/*.config.js',
      '**/*.config.cjs',
      '**/*.config.mjs',
      'bin/**',
      'scripts/**',
    ],
  },
  {
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      // Import rules
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

      // Prettier
      'prettier/prettier': 'error',

      // Promise rules
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/no-native': 'off',
      'promise/no-nesting': 'warn',
      'promise/no-promise-in-callback': 'warn',
      'promise/no-callback-in-promise': 'warn',
      'promise/avoid-new': 'off',
      'promise/no-new-statics': 'error',
      'promise/no-return-in-finally': 'warn',
      'promise/valid-params': 'warn',
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
]

// // Global configuration for all files
// {
//   files: ['**/*.{js,mjs,cjs,ts}'],
//   languageOptions: {
//     ecmaVersion: 2022,
//     sourceType: 'module',
//     parser: tseslint.parser,
//     parserOptions: {
//       project: './tsconfig.json',
//       tsconfigRootDir: import.meta.dirname,
//     },
//   },
//   plugins: {
//     '@typescript-eslint': tseslint.plugin,
//     import: importPlugin,
//     jest: jestPlugin,
//     node: nodePlugin,
//     prettier: prettierPlugin,
//     promise: promisePlugin,
//     security: securityPlugin,
//   },
// // Configuration for test files
// {
//   files: ['**/*.spec.{js,ts}', '**/*.test.{js,ts}'],
//   languageOptions: {
//     globals: {
//       jest: 'readonly',
//       describe: 'readonly',
//       it: 'readonly',
//       expect: 'readonly',
//       beforeEach: 'readonly',
//       afterEach: 'readonly',
//       beforeAll: 'readonly',
//       afterAll: 'readonly',
//     },
//   },
//   rules: {
//     '@typescript-eslint/no-explicit-any': 'off',
//     'jest/expect-expect': 'warn',
//     'jest/no-disabled-tests': 'warn',
//     'jest/no-focused-tests': 'error',
//     'jest/no-identical-title': 'error',
//     'jest/prefer-to-have-length': 'warn',
//     'jest/valid-expect': 'error',
//   },
// },

// // Configuration for CommonJS files
// {
//   files: ['**/*.cjs'],
//   languageOptions: {
//     sourceType: 'commonjs',
//   },
// },
