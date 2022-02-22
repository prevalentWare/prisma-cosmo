import { ParsedGQLModel } from '../types';
import { createDirectory } from './createDirectory';
import { writeFile } from './writeFile';
import path from 'path';

const createTypeFile = async (gqlModel: ParsedGQLModel) => {
  await createDirectory(`prisma/generated/${gqlModel.name.toLowerCase()}`);
  await writeFile(
    path.join(
      process.cwd(),
      `prisma/generated/${gqlModel.name.toLowerCase()}/types.ts`
    ),
    gqlModel.model
  );
};

export { createTypeFile };
