import { GQLModel } from '../types';
import { capitalize } from './capitalize';
import path from 'path';
import { writeFile } from './writeFile';

const createBaseTypeFile = async (gqlModels: GQLModel[] | undefined) => {
  const hasEnums = JSON.stringify(gqlModels).includes('enum');
  console.log('hasEnums', hasEnums);
  const baseFile = `
    import { gql } from 'apollo-server-micro';
    ${gqlModels
      ?.map(
        (model) =>
          `import { ${capitalize(
            model.name
          )}Types } from './${model.name.toLowerCase()}/types'`
      )
      .join(';')}
    
    ${hasEnums ? "import { GQLEnums } from './enums'" : ''};

    const genericTypes = gql\`
    scalar DateTime
    scalar Json
    scalar Bytes
    scalar Decimal
    scalar BigInt
    input StringInput{
      set:String
    }
    input FloatInput{
      set:Float
    }
    input BooleanInput{
      set:Boolean
    }
    input IntInput{
      set:Int
    }
    input DateTimeInput{
      set:DateTime
    }
    input DecimalInput{
      set:Decimal
    }
    \`;

    export const types = [genericTypes, ${
      hasEnums ? 'GQLEnums,' : ''
    } ${gqlModels
    ?.map((model) => `${capitalize(model.name)}Types`)
    .join(', ')}];

  `;

  await writeFile(
    path.join(process.cwd(), `prisma/generated/graphql/types.ts`),
    baseFile
  );
};

export { createBaseTypeFile };
