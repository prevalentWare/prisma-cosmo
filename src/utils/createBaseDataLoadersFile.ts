import { GQLModel } from '../types';
import { writeFile } from './writeFile';
import { unCapitalize } from './capitalize';
import path from 'path';

const createBaseDataLoadersFile = async (gqlModels: GQLModel[] | undefined) => {
  if (gqlModels) {
    const baseFile = `
      ${gqlModels.map((model) => {
          return `import { ${unCapitalize( model.name)}DataLoader } from './${model.name.toLowerCase()}/dataLoaders';`;
        })
        .join('\n')}
  
      const dataLoadersArray = [${gqlModels
        .map((model) => `${unCapitalize( model.name)}DataLoader`)
        .join(', ')}];
        export default dataLoadersArray;
      `;
    await writeFile(
      path.join(process.cwd(), `prisma/generated/aws/models/dataLoaders.ts`),
      baseFile
    );
  }
};

export { createBaseDataLoadersFile };