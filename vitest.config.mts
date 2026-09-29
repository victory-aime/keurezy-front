import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

/** Tests unitaires de la logique pure (environnement Node, sans DOM). */
export default defineConfig({
  resolve: {
    alias: { _utils: fileURLToPath(new URL('./src/utils', import.meta.url)) },
  },
  test: { include: ['src/**/*.test.ts'], environment: 'node' },
});
