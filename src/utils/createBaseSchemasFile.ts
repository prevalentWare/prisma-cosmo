// import { GQLModel } from '../types';
// import { ParsedGQLModel } from '../types';
// import { capitalize } from './capitalize';
import { unCapitalize } from './capitalize';
import path from 'path';
import { writeFile } from './writeFile';

const createBaseSchemasFile = async (gqlModels: any, enums: RegExpMatchArray | null) => {
  const baseFile = `  
  
  
  input StringInput {
    set: String
  }
  input FloatInput {
    set: Float
  }
  input BooleanInput {
    set: Boolean
  }
  input IntInput {
    set: Int
  }
  input DateTimeInput {
    set: AWSDateTime
  }
  input DecimalInput {
    set: Float
  }

  input AWSJSONInput {
    set: AWSJSON
  }
  

  input Decimal{
    set: Float
  }

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
  
  ${gqlModels?.map((model: any) => model.model)}

  type Mutation {
    ${gqlModels?.map((model: any) =>`
      create${model.name}(data:${model.name}CreateInput):${model.name}
      update${model.name}(where:${model.name}WhereUniqueInput!, data:${
      model.name
    }UpdateInput ):${model.name}  
      delete${model.name}(where: ${model.name}WhereUniqueInput!):${model.name}
  `)}
  }


  type Query{

    ${gqlModels?.map((model: any) =>`
    ${unCapitalize(model.name)}s:[${model.name}]
    ${unCapitalize(model.name)}(id:String!):${model.name}
   
`
    )}
 
  }
  `;

  await writeFile(
    path.join(process.cwd(), `prisma/generated/graphql/schema.gql`),
    baseFile
  );
};

export { createBaseSchemasFile };
