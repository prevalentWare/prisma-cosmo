import { GQLModel } from '../types';
import { writeFile } from './writeFile';
import { unCapitalize } from './capitalize';
import path from 'path';

const createBaseResolversFile = async (gqlModels: GQLModel[] | undefined) => {
  if (gqlModels) {
    const baseFile = `
      ${gqlModels
        .map((model) => {
          return `import { ${
            unCapitalize( model.name)
          }Resolvers } from './${model.name.toLowerCase()}/resolvers';`;
        })
        .join('\n')}
  
      const resolverArray = [${gqlModels
        .map((model) => `${unCapitalize( model.name)}Resolvers`)
        .join(', ')}];
        export default resolverArray;
      `;
    await writeFile(
      path.join(process.cwd(), `prisma/generated/aws/models/index.ts`),
      baseFile
    );
  }
};

export { createBaseResolversFile };
