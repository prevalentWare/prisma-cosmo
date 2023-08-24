import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { parseModel } from './utils/parseModel';
import { createBaseSchemasFile } from './utils/createBaseSchemasFile';
import { generateSchemaObject } from './utils/generateSchemaObject';
import { createResolversFiles } from './utils/createResolversFiles';
import { createBaseDataLoadersFile } from './utils/createBaseDataLoadersFile';
import { createBaseResolversFile } from './utils/createBaseResolversFile';
import { createResolvers } from './utils/createResolversModel';
import { createDirectory } from './utils/createDirectory';
import {createDataLoaders} from './utils/createDataLoadersModel'
import { createSessionConfig } from './utils/createSessionConfig';
import rimraf from 'rimraf';

// import { generateTypeObject } from './utils/generateTypeObject';
// import { createBaseTypeFile } from './utils/createBaseTypeFile';
// import { createEnumFile } from './utils/createEnumFile';

const readFile = promisify(fs.readFile);
const rmrf = promisify(rimraf);

const cosmo = async () => {
  // read models from prisma file
  const file = await readFile(
    path.join(process.cwd(), 'prisma/schema.prisma'),
    { encoding: 'utf-8',}
  );
  await rmrf('./prisma/generated/aws');

  createDirectory('./prisma/generated');
  createDirectory('./prisma/generated/aws');
  createDirectory('./prisma/generated/aws/graphql');
  createDirectory('./prisma/generated/aws/sessionConfig');
  createDirectory('./prisma/generated/aws/models');


  // parse models to object
  const models = file.match(/model([^}]+)}/g);
  const parsedModels = models?.map((m: string) => {
    return parseModel(m);
  });

  // create file for enums
  const enums = file.match(/enum([^}]+)}/g);
 
  // create file containing the types for every model
  const gqlSchemas = parsedModels?.map((model) => {
    return generateSchemaObject(model);
  });
  await createBaseSchemasFile(gqlSchemas, enums);


 await createSessionConfig(gqlSchemas,parsedModels);
  //create files resolvers for every model
  gqlSchemas?.map(async (gqlSchemas) => {
    await createResolversFiles(gqlSchemas);
  });

  // create resolvers
  parsedModels?.map(async (model) => {
    await createResolvers(model, parsedModels);
  });
  parsedModels?.map(async (model) => {
    await createDataLoaders(model, parsedModels);
  });

  //create resolver file
  await createBaseResolversFile(parsedModels);

  await createBaseDataLoadersFile(parsedModels);
};

export { cosmo };

  // create base type file for exporting all the types
  // await createBaseTypeFile(parsedModels);