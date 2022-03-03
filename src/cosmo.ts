import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { createBaseResolversFile } from './utils/createBaseResolversFile';
import { createBaseTypeFile } from './utils/createBaseTypeFile';
import { createDirectory } from './utils/createDirectory';
import { createEnumFile } from './utils/createEnumFile';
import { createResolvers } from './utils/createResolvers';
import { createTypeFile } from './utils/createTypeFiles';
import { generateTypeObject } from './utils/generateTypeObject';
import { parseModel } from './utils/parseModel';
import rimraf from 'rimraf';

const readFile = promisify(fs.readFile);
const rmrf = promisify(rimraf);

const cosmo = async () => {
  // read models from prisma file
  const file = await readFile(
    path.join(process.cwd(), 'prisma/schema.prisma'),
    {
      encoding: 'utf-8',
    }
  );

  await rmrf('./prisma/generated/graphql');

  createDirectory('./prisma/generated');
  createDirectory('./prisma/generated/graphql');
  // parse models to object
  const models = file.match(/model([^}]+)}/g);
  const parsedModels = models?.map((m: string) => {
    return parseModel(m);
  });

  // create file for enums
  const enums = file.match(/enum([^}]+)}/g);
  await createEnumFile(enums);

  // generate Graphql type structure
  const gqlModels = parsedModels?.map((model) => {
    return generateTypeObject(model);
  });

  // create file containing the types for every model
  gqlModels?.map(async (gqlModel) => {
    await createTypeFile(gqlModel);
  });

  // create base type file for exporting all the types
  await createBaseTypeFile(parsedModels);

  // create resolvers
  parsedModels?.map(async (model) => {
    await createResolvers(model, parsedModels);
  });

  //create resolver file
  await createBaseResolversFile(parsedModels);
};

export { cosmo };
