import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs['flat/recommended'],
  prettier,
  ...svelte.configs['flat/prettier'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'no-tabs': 'warn',
      // This is rule is not working properly (URL, templatestrings, ...)
      'svelte/no-navigation-without-resolve': 'off'
    }
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser
      }
    }
  },
  {
    // handle .svelte.ts files as regular ts files
    files: ['**/*.svelte.ts'],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        project: './tsconfig.json'
      }
    }
  },
  {
    ignores: ['build/', '.svelte-kit/', 'dist/']
  }
);
