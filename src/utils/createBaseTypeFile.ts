import { GQLModel } from '../types';
import { capitalize } from './capitalize';
import path from 'path';
import { writeFile } from './writeFile';

const createBaseTypeFile = async (gqlModels: GQLModel[] | undefined) => {

  const baseFile = `
    import { gql } from 'apollo-server-micro';
    ${gqlModels
      ?.map(
        (model) =>
          `import { ${capitalize(
            model.name
          )}Types } from './${model.name.toLowerCase()}/types'`
      )
      .join(';')}
    import { GQLEnums } from './enums';

    const genericTypes = gql\`
    scalar DateTime
    \`;

    export const types = [genericTypes, GQLEnums, ${gqlModels
      ?.map((model) => `${capitalize(model.name)}Types`)
      .join(', ')}];

  `;

  await writeFile(
    path.join(process.cwd(), `prisma/generated/types.ts`),
    baseFile
  );
};

export { createBaseTypeFile };
