import { defineConfig } from 'tsup';

export default defineConfig({
  watch: ["src/**/*"],
  entry: ['src/index.ts', 'src/preload.ts'],
  format: ['cjs'],
  platform: 'node',
  outDir: '../test2'
})