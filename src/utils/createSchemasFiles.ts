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

     input StringFilter {
    equals: String
    contains: String
    in: [String!]
    notIn: [String!]
    lt: String
    lte: String
    gt: String
    gte: String
    startsWith: String
    endsWith: String
    mode: String
  }

  input DateFilter {
    equals: String # Filter for exact match
    lt: String # Filter for less than
    lte: String # Filter for less than or equal to
    gt: String # Filter for greater than
    gte: String # Filter for greater than or equal to
  }

  enum OrderByDirection {
    asc # Ascending order
    desc # Descending order
  }

  type Query {
    getSignedUrlForUpload(file: String): PresignedURL
    getMultipleSignedUrlsForUpload(files: [String]): [PresignedURL]
  }
    
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
