import { createDirectory } from './createDirectory';
import path from 'path';
import { writeFile } from './writeFile';

const createEnumFile = async (enums: RegExpMatchArray | null) => {
  const ens = `
  import {gql} from 'apollo-server-micro'
  
  const GQLEnums = gql\`
    ${enums
      ?.map((en) => {
        return en;
      })
      .join(';')}
  \`

  export {GQLEnums}
  `;

  await writeFile(path.join(process.cwd(), `prisma/generated/enums.ts`), ens);
};

export { createEnumFile };
