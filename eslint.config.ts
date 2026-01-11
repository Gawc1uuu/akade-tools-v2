import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';

export default defineConfig([
  {
    ignores: ['**/.next/*'],
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      js,
      eslintPluginSimpleImportSort,
    },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  tseslint.configs.recommended,
  eslintConfigPrettier,
]);
