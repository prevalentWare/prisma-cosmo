import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { parseModel } from './utils/parseModel';
import { createSchemasFiles } from './utils/createSchemasFiles';
import { generateSchemaObject } from './utils/generateSchemaObject';
import { createModelsFiles } from './utils/createModelsFiles';
import { createBaseResolversFile } from './utils/createBaseResolversFile';
import { createResolvers } from './utils/createResolversModel';
import { createDirectory } from './utils/createDirectory';
import { createDataLoaders } from './utils/createDataLoadersModel'
import { createSessionConfig } from './utils/createSessionConfig';
import { createTypeObject } from './utils/generateTypeObject';
import rimraf from 'rimraf';

const readFile = promisify(fs.readFile);
const rmrf = promisify(rimraf);

const cosmo = async () => {
  // read models from prisma file
  const file = await readFile(
    path.join(process.cwd(), 'prisma/schema.prisma'),
    { encoding: 'utf-8', }
  );

  await rmrf('./prisma/generated');
  createDirectory('./prisma/generated');
  // createDirectory('./prisma/generated/sessionConfig');
  createDirectory('./prisma/generated/models');

  // parse models to object
  const models = file.match(/model([^}]+)}/g);
  const parsedModels = models
    ?.filter((el) => !el.includes('cosmo-ignore'))
    .map((m: string) => {
      return parseModel(m);
    });

  // create file for enums
  const enums = file.match(/enum([^}]+)}/g);
  const parsedEnums = Array.from(file.matchAll(/enum\s+([A-Za-z_][A-Za-z0-9_]*)/g)).map(match => match[1]);

  // create file containing the types for every model
  const gqlSchemas = await parsedModels?.map((model) => {
    return generateSchemaObject(model);
  });

  // create files resolvers for every model
  await createModelsFiles(gqlSchemas)

  await createSchemasFiles(gqlSchemas, enums);

  await createSessionConfig(gqlSchemas, parsedModels);

  // create file containing the types in typescript for every model
  await createTypeObject(parsedModels, parsedEnums);

  // create resolvers
  parsedModels?.map(async (model) => {
    await createResolvers(model, parsedModels);
  });
  parsedModels?.map(async (model) => {
    await createDataLoaders(model, parsedModels);
  });

  //create resolver file
  await createBaseResolversFile(parsedModels);

};

export { cosmo };

