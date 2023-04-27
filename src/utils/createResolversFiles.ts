import { ParsedGQLModel } from '../types';
import { createDirectory } from './createDirectory';

const createResolversFiles = async (gqlModel: ParsedGQLModel) => {
  await createDirectory(
    `prisma/generated/aws/models/${gqlModel.name.toLowerCase()}`
  );
};
export { createResolversFiles  };