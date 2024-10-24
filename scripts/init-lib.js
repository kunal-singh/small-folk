import fs from 'node:fs/promises';
import path from 'node:path';

const validateName = (name) => {
  const valid = /^[a-z0-9-]+$/i.test(name);
  if (!valid) {
    throw new Error(
      'Library name must contain only letters, numbers, and hyphens'
    );
  }
  return name.toLowerCase();
};

const createLibFiles = async (name) => {
  try {
    const libPath = path.join('packages', 'libs', name);

    // Create directory
    await fs.mkdir(libPath, { recursive: true });

    // Create package.json
    await fs.writeFile(
      path.join(libPath, 'package.json'),
      JSON.stringify(
        {
          name: `@small-folk/${name}`,
          version: '1.0.0',
          type: 'module',
          main: 'dist/index.js',
          module: 'dist/index.js',
          exports: {
            '.': {
              import: './dist/index.js',
            },
            './package.json': './package.json',
          },
          files: ['dist'],
          scripts: {
            build: 'vite build',
            test: 'vitest',
            lint: 'eslint . --ext .js --fix',
          },
          devDependencies: {
            vite: '^5.1.4',
            vitest: '^1.3.1',
          },
        },
        null,
        2
      )
    );

    // Create README.md
    await fs.writeFile(
      path.join(libPath, 'README.md'),
      `# @small-folk/${name}\n`
    );

    // Create src/index.js
    await fs.mkdir(path.join(libPath, 'src'), { recursive: true });
    await fs.writeFile(
      path.join(libPath, 'src', 'index.js'),
      `/**
 * @small-folk/${name}
 */\n`
    );

    // Create test file
    await fs.writeFile(
      path.join(libPath, 'src', 'index.test.js'),
      `import { describe, it } from 'vitest';

describe('@small-folk/${name}', () => {
  it('should be implemented', () => {
    // Add your tests here
  });
});\n`
    );

    // Create vite.config.js
    await fs.writeFile(
      path.join(libPath, 'vite.config.js'),
      `import { defineConfig } from 'vite';

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
});\n`
    );

    console.log(`✅ Library '@small-folk/${name}' initialized successfully!`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

const name = process.argv[2];

if (!name) {
  console.error('❌ Error: Library name is required');
  process.exit(1);
}

try {
  const validName = validateName(name);
  await createLibFiles(validName);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
