import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // `components/reui` and `components/ui` are copy-and-own registry code
  // installed verbatim by the shadcn CLI (`shadcn add @reui/...`) - vendor
  // primitives, not hand-authored app code, so they're excluded from lint
  // the same way a vendored dependency would be.
  globalIgnores(['dist', 'src/components/reui/**', 'src/components/ui/**']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
])
