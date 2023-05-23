import { createDirectory } from './createDirectory';
import path from 'path';
import { writeFile } from './writeFile';

const createEnumFile = async (enums: RegExpMatchArray | null) => {
  const ens = `
  import {gql} from 'apollo-server-micro'
  
  const GQLEnums = gql\`
    ${enums
      ?.map((en) => {
        const name = en.match(/(?<=enum )(.*?)(?= \{)/g);
        return `
        ${en.replace(/(?<=\@)(.*?)(?=\))/g, '').replace(/@\)/g, '')}
        input ${name ? name[0] : ''}Input{
          set:${name ? name[0] : ''}
        }
        `;
      })
      .join('\n')}
  \`

  export {GQLEnums}
  `;

  if (enums && enums?.length > 0) {
    await writeFile(
      path.join(process.cwd(), `prisma/generated/graphql/enums.ts`),
      ens
    );
  }
};

export { createEnumFile };
