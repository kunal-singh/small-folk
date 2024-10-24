import fs from 'node:fs/promises';
import path from 'node:path';

const LIBS_PATH = path.join('packages', 'libs');

const validateName = (name) => {
  const valid = /^[a-z0-9][a-z0-9-]{0,48}[a-z0-9]$/i.test(name);
  if (!valid) {
    throw new Error(
      'Library name must start and end with a letter or number, contain only letters, numbers, and hyphens, and be between 1 and 50 characters long'
    );
  }
  return name.toLowerCase();
};

const createLibFiles = async (name) => {
  try {
    const libPath = path.join(LIBS_PATH, name);

    // Check if folder already exists
    try {
      await fs.access(libPath);
      throw new Error(`Library '${name}' already exists`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }

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
      `import { createLibConfig } from '../../vite.config.base.js';

export default createLibConfig({
  entry: 'src/index.js',
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
