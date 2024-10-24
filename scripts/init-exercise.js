import fs from 'node:fs/promises';
import path from 'node:path';

const EXERCISES_PATH = path.join('src', 'exercises');
const MAIN_INDEX_PATH = path.join('src', 'index.js');
const README_TEMPLATE_PATH = 'exercise-readme.md';

const validateName = (name) => {
  const valid = /^[a-z0-9][a-z0-9-]{0,48}[a-z0-9]$/i.test(name);
  if (!valid) {
    throw new Error(
      'Exercise name must start and end with a letter or number, contain only letters, numbers, and hyphens, and be between 1 and 50 characters long'
    );
  }
  return name.toLowerCase();
};

const createExerciseFiles = async (name) => {
  try {
    const exercisePath = path.join(EXERCISES_PATH, name);

    // Check if folder already exists
    try {
      await fs.access(exercisePath);
      throw new Error(`Exercise '${name}' already exists`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }

    // Create directory
    await fs.mkdir(exercisePath, { recursive: true });

    // Create README.md using template
    const readmeTemplate = await fs.readFile(README_TEMPLATE_PATH, 'utf-8');
    const readme = readmeTemplate.replace(/\{\{name\}\}/g, name);
    await fs.writeFile(path.join(exercisePath, 'README.md'), readme);

    // Create index.js
    await fs.writeFile(
      path.join(exercisePath, 'index.js'),
      `/**
 * ${name} exercise implementation
 */
export const ${name.replace(/-([a-z])/g, (g) => g[1].toUpperCase())} = () => {
  // TODO: Implement your solution
};\n`
    );

    // Create test file
    await fs.writeFile(
      path.join(exercisePath, 'index.test.js'),
      `import { describe, it, expect } from 'vitest';
import { ${name.replace(/-([a-z])/g, (g) => g[1].toUpperCase())} } from './index.js';

describe('${name}', () => {
  it('should be implemented', () => {
    expect(${name.replace(/-([a-z])/g, (g) => g[1].toUpperCase())}()).toBeDefined();
  });
});\n`
    );

    // Update main index.js
    const currentContent = await fs.readFile(MAIN_INDEX_PATH, 'utf-8');
    const newExport = `export * from './exercises/${name}/index.js';\n`;

    if (!currentContent.includes(newExport)) {
      await fs.writeFile(
        MAIN_INDEX_PATH,
        currentContent.replace(
          /\/\/ Export other exercise modules here/,
          `${newExport}// Export other exercise modules here`
        )
      );
    }

    console.log(`✅ Exercise '${name}' initialized successfully!`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

const name = process.argv[2];

if (!name) {
  console.error('❌ Error: Exercise name is required');
  process.exit(1);
}

try {
  const validName = validateName(name);
  await createExerciseFiles(validName);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
