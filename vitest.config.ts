/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [],
  test: {
    globals: true, // use describe/it/expect without import
    include: [
      'src/**/__tests__/**/*.{spec,test}.{ts,tsx}',
      'tests/**/*.{spec,test}.{ts,tsx}',
    ],
  },
});
