module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@next/next/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'simple-import-sort',
    'sort-keys-custom-order-fix',
    'unused-imports',
    'chakra-ui',
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: ['PascalCase'],
        prefix: ['I'],
        selector: 'interface',
      },
      {
        format: ['PascalCase'],
        prefix: ['T'],
        selector: 'typeAlias',
      },
      {
        format: ['camelCase'],
        selector: ['variable'],
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'chakra-ui/props-order': 'off',
    'chakra-ui/props-shorthand': [
      'error',
      {
        applyToAllComponents: true,
        noShorthand: true,
      },
    ],
    'chakra-ui/require-specific-component': 'error',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            message:
              'To reduce bundle size, import from the chakra packages directly. See: https://github.com/chakra-ui/chakra-ui/issues/4975#issuecomment-1169169218',
            name: '@chakra-ui/react',
          },
          {
            message:
              "To reduce bundle size, import only the required lodash function. Example: import get from 'lodash/get'",
            name: 'lodash',
          },
        ],
      },
    ],
    'object-shorthand': ['error', 'always'],
    'react/jsx-curly-brace-presence': 'error',
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        ignoreCase: true,
        noSortAlphabetically: false,
        reservedFirst: true,
        shorthandLast: true,
      },
    ],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-keys-custom-order-fix/sort-keys-custom-order-fix': [
      'error',
      'custom',
      {
        caseSensitive: true,
        natural: true,
        order: [
          '_light',
          '_dark',
          'base',
          'sm',
          'md',
          'lg',
          'xl',
          '2xl',
          'id',
          'accessor',
          'Header',
          'Footer',
          'second',
          'minute',
          'hour',
          'day',
          'week',
          'month',
          'year',
        ],
        orderBy: 'asc',
      },
    ],
    'unused-imports/no-unused-imports-ts': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
