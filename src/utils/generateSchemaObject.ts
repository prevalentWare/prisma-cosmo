import { GQLModel } from '../types';
import { unCapitalize } from './capitalize';

const generateSchemaObject = (model: GQLModel) => {
  //TODO: change query id field

  const gqlFields = model.fields.map((field) => {
    field.gqlType=field.gqlType.replace("DateTime", "AWSDateTime")
    field.gqlType=field.gqlType.replace("Json", "AWSJSON")
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
          'AWSDateTime',
          'AWSJSON',
          'Decimal',
        ].includes(f.gqlType.replace('!', '')) ||
          f.gqlType.replace('!', '').toLowerCase().includes('enum')) &&
        f.name !== 'createdAt' &&
        f.name !== 'updatedAt'
    )
    .map((field) => {
      const fld = field.gqlType.replace('!', '');
      return `${field.name}: ${fld}${fld !== 'Json' ? 'Input' : ''}`;
    });

  const gqlModel = `
  type ${model.name}{
    ${gqlFields}
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
          type == 'AWSJSON' ||
          type == 'Decimal' ||
          type.toLocaleLowerCase().includes('enum') ||
          type == 'AWSDateTime') &&
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
  `;

  return { name: model.name, model: gqlModel };
};

export { generateSchemaObject };
