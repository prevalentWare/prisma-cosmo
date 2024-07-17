import path from 'path';
import { writeFile } from './writeFile';

const createTypesFile = async (
  gqlModels: any,
) => {
  gqlModels?.map(async (model: any) => {
    writeFile(
      path.join(
        process.cwd(),
        `prisma/generated/types.ts`
      ),
      `${model.model}`
    );
  });
};

export { createTypesFile };
