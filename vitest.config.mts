import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
    include: ['lib/**/*.test.ts'],   // sadece lib/ altındaki testleri çalıştır
    alias: {
      '@': import.meta.dirname,
    },
  },
})
