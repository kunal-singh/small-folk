import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [],
      output: {
        preserveModules: true,
        entryFileNames: '[name].js',
      },
    },
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
