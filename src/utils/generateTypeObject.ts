import { GQLModel } from '../types';

const generateTypeObject = (model: GQLModel) => {
  //TODO: change query id field

  const gqlFields = model.fields.map((field) => {
    return `${field.name}: ${field.gqlType}`;
  });
  const gqlModel = `
  import {gql} from 'apollo-server-micro'

  const ${model.name}Types = gql\`
  type ${model.name}{
    ${gqlFields}
  }

  type Query{
    get${model.name}s:[${model.name}]
    get${model.name}(id:String!):${model.name}
  }

  input InputCreate${model.name}{
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

  input InputWhere${model.name}{
    id:String!
  }

  input InputUpdate${model.name}{
  ${gqlFields
    .filter((f) => {
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
    })
    .map((f) => {
      return f.replace('!', '');
    })
    .join('\n')}
  }

  type Mutation {
  create${model.name}(data:InputCreate${model.name}):${model.name}

  update${model.name}(where:InputWhere${model.name}!, data:InputUpdate${
    model.name
  } ):${model.name}

  delete${model.name}(where: InputWhere${model.name}!):${model.name}

    }
  \`
  export {${model.name}Types}
    `;

  return { name: model.name, model: gqlModel };
};

export { generateTypeObject };
