import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

interface SchemaInfo {
  hasMultipleSchemas: boolean;
  isGenerated: boolean;
  schemaFiles: string[];
}

const getSchemaInfo = (): SchemaInfo => {
  const prismaDir = path.join(process.cwd(), 'prisma');
  const schemaDir = path.join(prismaDir, 'schema');
  const targetFile = path.join(prismaDir, 'schema.prisma');

  // Check if schema directory exists
  if (!fs.existsSync(schemaDir)) {
    // If no schema directory, check if there's a single schema.prisma file
    if (fs.existsSync(targetFile)) {
      return {
        hasMultipleSchemas: false,
        isGenerated: false,
        schemaFiles: ['schema.prisma'],
      };
    }
    throw new Error('No schema files found');
  }

  // Read all .prisma files from the schema directory
  const schemaFiles = fs
    .readdirSync(schemaDir)
    .filter((file) => file.endsWith('.prisma'));

  return {
    hasMultipleSchemas:
      schemaFiles.length > 1 ||
      (schemaFiles.length === 1 && schemaFiles[0] !== 'schema.prisma'),
    isGenerated:
      schemaFiles.length > 1 ||
      (schemaFiles.length === 1 && schemaFiles[0] !== 'schema.prisma'),
    schemaFiles,
  };
};

const mergeSchemaFiles = async (): Promise<void> => {
  const prismaDir = path.join(process.cwd(), 'prisma');
  const schemaDir = path.join(prismaDir, 'schema');
  const targetFile = path.join(prismaDir, 'schema.prisma');

  const { hasMultipleSchemas, schemaFiles } = getSchemaInfo();

  // If no multiple schemas, no need to merge
  if (!hasMultipleSchemas) {
    return;
  }

  // Read and merge all schema contents
  const mergedContent = await Promise.all(
    schemaFiles.map(async (file) => {
      const content = await readFile(path.join(schemaDir, file), 'utf-8');
      return `// --- ${file} ---\n${content}\n`;
    })
  );

  // Write merged content to schema.prisma
  await writeFile(targetFile, mergedContent.join('\n'), 'utf-8');
};

const cleanGeneratedSchema = async (): Promise<void> => {
  const prismaDir = path.join(process.cwd(), 'prisma');
  const targetFile = path.join(prismaDir, 'schema.prisma');

  const { isGenerated } = getSchemaInfo();

  // Only delete if the schema was generated from multiple files
  if (isGenerated && fs.existsSync(targetFile)) {
    await unlink(targetFile);
  }
};

export { mergeSchemaFiles, cleanGeneratedSchema };
