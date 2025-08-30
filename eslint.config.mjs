// @ts-nocheck
import js from '@eslint/js';
import globals from 'globals';
import parser from '@typescript-eslint/parser';
import tseslint from '@typescript-eslint/eslint-plugin';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // TypeScript rules - فقط قوانین مهم
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      
      // General rules - قوانین عمومی
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'warn',
    },
  },
];
