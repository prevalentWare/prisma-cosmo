// import { GQLModel } from '../types';
// import { capitalize } from './capitalize';
// import path from 'path';
// import { writeFile } from './writeFile';

// const createBaseTypeFile = async (gqlModels: GQLModel[] | undefined) => {
//   const baseFile = `
//     import { gql } from 'apollo-server-micro';
//     ${gqlModels
//       ?.map(
//         (model) =>
       
//           `import  ${capitalize(
//             model.name
//           )}Types  from './${model.name.toLowerCase()}/${model.name.toLowerCase()}.graphql'`
//       )
//       .join(';')}
//     import { GQLEnums } from './enums';
//     import 'graphql-import-node'
//     const genericTypes = gql\`
//     scalar DateTime
//     scalar Json
//     scalar Decimal
//     input StringInput{
//       set:String
//     }
//     input FloatInput{
//       set:Float
//     }
//     input BooleanInput{
//       set:Boolean
//     }
//     input IntInput{
//       set:Int
//     }
//     input DateTimeInput{
//       set:DateTime
//     }
//     input DecimalInput{
//       set:Decimal
//     }
//     \`;

//     export const types = [genericTypes, GQLEnums, ${gqlModels
//       ?.map((model) => `${capitalize(model.name)}Types`)
//       .join(', ')}];

//   `;

//   await writeFile(
//     path.join(process.cwd(), `prisma/generated/graphql/types.ts`),
//     baseFile
//   );
// };

// export { createBaseTypeFile };
