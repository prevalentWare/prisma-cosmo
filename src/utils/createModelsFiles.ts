import { createDirectory } from './createDirectory';

const createModelsFiles = async (gqlModel: any) => {
  gqlModel.map(async(model:any) => {
    await createDirectory(
      `prisma/generated/models/${model.name.toLowerCase()}`
    );
  })
  await createDirectory(
    `prisma/generated/models/general`
  );
};
export { createModelsFiles  };