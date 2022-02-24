import { GQLModel } from '../types';
import { unCapitalize } from './capitalize';

const generateTypeObject = (model: GQLModel) => {
  //TODO: change query id field

  const gqlFields = model.fields.map((field) => {
    return `${field.name}: ${field.gqlType}`;
  });

  const gqlUpdateFields = model.fields
    .filter(
      (f) =>
        (['String', 'Float', 'Int', 'Boolean', 'DateTime', 'Json'].includes(
          f.gqlType.replace('!', '')
        ) ||
          f.gqlType.replace('!', '').toLowerCase().includes('enum')) &&
        f.name !== 'createdAt' &&
        f.name !== 'updatedAt'
    )
    .map((field) => {
      return `${field.name}: ${field.gqlType.replace('!', '')}Input`;
    });
  const gqlModel = `
  import {gql} from 'apollo-server-micro'

  const ${model.name}Types = gql\`
  type ${model.name}{
    ${gqlFields}
  }

  type Query{
    ${unCapitalize(model.name)}s:[${model.name}]
    ${unCapitalize(model.name)}(id:String!):${model.name}
  }

  input ${model.name}CreateInput{
    ${gqlFields.filter((f) => {
      return (
        (f.includes('String') ||
          f.includes('Int') ||
          f.includes('Float') ||
          f.includes('Boolean') ||
          f.includes('Json') ||
          f.toLocaleLowerCase().includes('enum') ||
          f.includes('DateTime')) &&
        !f.includes('createdAt') &&
        !f.includes('updatedAt')
      );
    })}
  }

  input ${model.name}WhereUniqueInput{
    id:String!
  }

  input ${model.name}UpdateInput{
  ${gqlUpdateFields
    .map((f) => {
      return f.replace('!', '');
    })
    .join('\n')}
  }

  type Mutation {
  create${model.name}(data:${model.name}CreateInput):${model.name}

  update${model.name}(where:${model.name}WhereUniqueInput!, data:${
    model.name
  }UpdateInput ):${model.name}

  delete${model.name}(where: ${model.name}WhereUniqueInput!):${model.name}

    }
  \`
  export {${model.name}Types}
    `;

  return { name: model.name, model: gqlModel };
};

export { generateTypeObject };
