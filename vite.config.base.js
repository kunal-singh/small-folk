import { defineConfig } from 'vite';
import { resolve } from 'path';

export const createLibConfig = (options = {}) => {
  const {
    entry = 'src/index.js',
    formats = ['es'],
    fileName = 'index',
    external = [],
  } = options;

  return defineConfig({
    build: {
      lib: {
        entry: resolve(process.cwd(), entry),
        formats,
        fileName,
      },
      rollupOptions: {
        external,
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
};

export default createLibConfig();