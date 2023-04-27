
import { unCapitalize } from './capitalize';
import path from 'path';
import { writeFile } from './writeFile';

const createBaseSchemasFile = async (gqlModels: any, enums: RegExpMatchArray | null) => {
  const baseFile = `  
  ${enums
      ?.map((en) => {
        const name = en.match(/(?<=enum )(.*?)(?= \{)/g);
        return `
${en.replace(/(?<=\@)(.*?)(?=\))/g, '').replace(/@\)/g, '')}
  `;
      })
      .join('\n')}
  
  ${gqlModels?.map((model: any) => model.model)}

  type Mutation {
    ${gqlModels?.map((model: any) => `
    # ${model.name}
    create${model.name}(data:${model.name}CreateInput):${model.name}
    update${model.name}(where:${model.name}WhereUniqueInput!, data:${model.name
      }UpdateInput ):${model.name}  
    upsert${model.name}(where:${model.name}WhereUniqueInput!, data:${model.name
    }CreateInput ):${model.name}    
    delete${model.name}(where: ${model.name}WhereUniqueInput!):${model.name}
  `)}
  }


  type Query{
    ${gqlModels?.map((model: any) => `
    # ${model.name}
    ${unCapitalize(model.name)}s:[${model.name}]
    ${unCapitalize(model.name)}(id:String!):${model.name}
`
        )}
  }
  `;

  await writeFile(
    path.join(process.cwd(), `prisma/generated/aws/graphql/schema.graphql`),
    baseFile
  );
};

export { createBaseSchemasFile };
