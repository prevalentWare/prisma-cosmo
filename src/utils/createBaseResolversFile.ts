import { GQLModel } from '../types';
import { writeFile } from './writeFile';
import path from 'path';

const createBaseResolversFile = async (gqlModels: GQLModel[] | undefined) => {
  const baseFile = `
    ${gqlModels
      .map((model) => {
        return `import { ${
          model.name
        }Resolvers } from './${model.name.toLowerCase()}/resolvers';`;
      })
      .join('\n')}

    export const resolvers = [${gqlModels
      .map((model) => `${model.name}Resolvers`)
      .join(', ')}];

    `;
  await writeFile(
    path.join(process.cwd(), `prisma/generated/graphql/resolvers.ts`),
    baseFile
  );
};

export { createBaseResolversFile };
