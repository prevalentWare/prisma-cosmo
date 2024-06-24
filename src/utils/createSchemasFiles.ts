import path from 'path';
import { writeFile } from './writeFile';

const createSchemasFiles = async (
  gqlModels: any,
  enums: RegExpMatchArray | null
) => {
  gqlModels?.map(async (model: any) => {
    writeFile(
      path.join(
        process.cwd(),
        `prisma/generated/models/${model.name.toLowerCase()}/types.ts`
      ),
      `${model.model}`
    );
  });

  const baseEnumsFile = `  
    import gql from 'graphql-tag';

    export const generalTypes = gql ${'`'}

    scalar DateTime
    
    ${
      enums?.length !== 0 && enums
        ? enums
            ?.map((en) => {
              const name = en.match(/(?<=enum )(.*?)(?= \{)/g);
              return ` ${en
                .replace(/(?<=\@)(.*?)(?=\))/g, '')
                .replace(/@\)/g, '')}`;
            })
            .join('\n')
        : ''
    }
        ${'`'}
  `;

  writeFile(
    path.join(process.cwd(), `prisma/generated/models/general/types.ts`),
    baseEnumsFile
  );
};

export { createSchemasFiles };
