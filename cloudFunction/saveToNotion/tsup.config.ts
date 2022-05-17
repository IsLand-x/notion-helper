import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: '.',
  watch: true,
  format: ['cjs']
})