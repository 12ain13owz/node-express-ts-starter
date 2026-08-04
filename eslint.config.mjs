// @ts-check
import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import-x'
import security from 'eslint-plugin-security'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig(
  // ── Ignores ───────────────────────────────────────────────────────────────
  {
    ignores: ['node_modules/**', 'dist/**', 'scripts/**', 'eslint.config.mjs'],
  },

  // ── TypeScript (Node.js / Express backend) ──────────────────────────────────
  {
    files: ['src/**/*.{js,mjs,cjs,ts}'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked, // type-aware rules for stricter linting
      prettier, // MUST be last: turns off ESLint rules that conflict with Prettier
    ],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        // Type-aware linting via the TypeScript project service (recommended over `project`)
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
      security,
    },
    rules: {
      // ── Safety & error handling ──────────────────────────────────────────────
      'no-async-promise-executor': 'error', // unsafe Promise executor functions
      'no-throw-literal': 'error', // always throw Error instances
      'no-eval': 'error', // disallow eval()
      '@typescript-eslint/no-floating-promises': 'error', // every Promise must be awaited/handled
      '@typescript-eslint/no-misused-promises': 'error', // catch async fns passed where sync is expected

      // ── Logging & environment ────────────────────────────────────────────────
      'no-console': ['error', { allow: ['warn', 'error'] }], // prefer the winston logger
      'no-process-env': 'warn', // read env through the central config module

      // ── Security ─────────────────────────────────────────────────────────────
      'security/detect-object-injection': 'warn',

      // ── Complexity (relaxed for Express handlers) ────────────────────────────
      complexity: ['warn', { max: 15 }],

      // ── TypeScript ───────────────────────────────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'error',
      // Auto-rewrite type-only imports to `import type` on --fix / save
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off', // implicit return types are fine for handlers
      '@typescript-eslint/require-await': 'off', // async middleware without await is common
      '@typescript-eslint/no-unused-vars': 'off', // delegated to unused-imports below

      // ── Imports ──────────────────────────────────────────────────────────────
      'unused-imports/no-unused-imports': 'error', // auto-remove unused imports on --fix
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index'], 'type'],
          pathGroups: [
            // Match the @/* alias defined in tsconfig.json
            { pattern: '@/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'never',
        },
      ],
    },
  }
)
