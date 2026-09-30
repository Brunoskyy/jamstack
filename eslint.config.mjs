import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'coverage/**', 'next-env.d.ts']),
  {
    rules: {
      // The banner and the logo are plain files served from /public; next/image
      // would add a loader for two images and nothing else.
      '@next/next/no-img-element': 'off',
    },
  },
])
