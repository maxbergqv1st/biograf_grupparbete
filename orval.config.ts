import { defineConfig } from 'orval';

export default defineConfig({
  biograf: {
    input: {
      target: 'http://localhost:5001/swagger/v2/swagger.json',
    },
    output: {
      target: './src/api/generated/endpoints.ts',
      schemas: './src/api/generated/models',
      mode: 'split',
      client: 'axios',
    },
  },
});
