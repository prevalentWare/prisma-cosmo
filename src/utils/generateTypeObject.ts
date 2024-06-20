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
        ([
          'String',
          'Float',
          'Int',
          'Boolean',
          'DateTime',
          'Json',
          'Decimal',
          'Bytes',
        ].includes(f.gqlType.replace('!', '')) ||
          f.gqlType.replace('!', '').toLowerCase().includes('enum')) &&
        f.name !== 'createdAt' &&
        f.name !== 'updatedAt'
    )
    .map((field) => {
      const fld = field.gqlType.replace('!', '');
      return `${field.name}: ${fld}${
        !['Json', 'Bytes'].includes(fld) ? 'Input' : ''
      }`;
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
      const name = f.split(':')[0];
      const type = f.split(':')[1].trim().replace('!', '');
      return (
        (type == 'String' ||
          type == 'Int' ||
          type == 'Float' ||
          type == 'Boolean' ||
          type == 'Json' ||
          type == 'Decimal' ||
          type == 'Bytes' ||
          type.toLocaleLowerCase().includes('enum') ||
          type == 'DateTime') &&
        name != 'createdAt' &&
        name != 'updatedAt'
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

