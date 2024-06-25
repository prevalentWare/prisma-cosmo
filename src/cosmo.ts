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
import rimraf from 'rimraf';
import { createTypesFile } from './utils/createTypesFile';
import { generateTypeObject } from './utils/generateTypeObject';

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
  createDirectory('./prisma/generated/sessionConfig');
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

  // create file containing the types for every model
  const gqlSchemas = await parsedModels?.map((model) => {
    return generateSchemaObject(model);
  });

  // create file containing the types in typescript for every model
  const gqlSchemasTypescript = await parsedModels?.map((model) => {
    return generateTypeObject(model);
  });

  // create files resolvers for every model
  await createModelsFiles(gqlSchemas)

  await createSchemasFiles(gqlSchemas, enums);

  await createTypesFile(gqlSchemasTypescript)

  await createSessionConfig(gqlSchemas, parsedModels);

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

