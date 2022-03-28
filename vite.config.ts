import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      reporter: ['lcov', 'text'],
      include: ['src/index.ts'],
    },
  },
})
