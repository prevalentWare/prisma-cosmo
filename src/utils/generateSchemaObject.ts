// Importaciones necesarias
import { GQLModel } from '../types';
import { unCapitalize } from './capitalize';

// Función para generar el esquema del objeto
const generateSchemaObject = (model: GQLModel) => {
  // Lista para almacenar los nombres de los campos
  const listNames: string[] = [];

  // Mapeo de los campos del modelo
  const gqlFields = model.fields.map((field) => {
    // Busca si el atributo tiene un valor por defecto
    const found = field.attributes.find(element => {
      if (element.includes("@default")) { return element }
    });

    // Si el campo tiene un valor por defecto y no es 'id' ni 'createdAt', se añade a la lista
    if (found && field.name != 'id' && field.name != 'createdAt') {
      listNames.push(field.name);
    }

    // Reemplaza los tipos de datos por su equivalente en GraphQL
    field.gqlType = field.gqlType.replace("DateTime", "DateTime");
    field.gqlType = field.gqlType.replace("Json", "JSON");

    // Devuelve el campo con su tipo de dato
    return `${field.name}: ${field.gqlType}`;
  });

  // Filtra y mapea los campos que se pueden actualizar
  const gqlUpdateFields = model.fields
    .filter(
      (f) =>
        ([
          'String',
          'Float',
          'Int',
          'Boolean',
          'DateTime',
          'JSON',
          'Decimal',
        ].includes(f.gqlType.replace('!', '')) ||
          f.gqlType.replace('!', '').toLowerCase().includes('enum')) &&
        f.name !== 'createdAt' &&
        f.name !== 'updatedAt'
    )
    .map((field) => {
      const fld = field.gqlType.replace('!', '');
      return `${field.name}: ${fld}${fld !== 'Json' ? '' : ''}`;
    });

  // Genera el modelo GraphQL
  const gqlModel = `
  import gql from 'graphql-tag';

  export const ${unCapitalize(model.name)}Types = gql ${"`"}

    type ${model.name}{
      ${gqlFields}
    }

    input ${model.name}CreateInput{
      ${gqlFields.filter((f) => {
      const name = f.split(':')[0];
      const type = f.split(':')[1].trim().replace('!', '');
      const found = listNames.find(element => {
        if (element.includes(name)) { return element }
      })
      return (
        ( type == 'String' ||
          type == 'Int' ||
          type == 'Float' ||
          type == 'Boolean' ||
          type == 'JSON' ||
          type == 'Decimal' ||
          type.toLocaleLowerCase().includes('enum') ||
          type == 'DateTime') &&
          name != 'createdAt' &&
          name != 'updatedAt' &&
          name != found
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
      }
    }
    type Query{
      ${unCapitalize(model.name)}s:[${model.name}]
      ${unCapitalize(model.name)}(id:String!):${model.name}
    }
    type Mutation {
        create${model.name}(data:${model.name}CreateInput):${model.name}
        update${model.name}(where:${model.name}WhereUniqueInput!, data:${model.name}UpdateInput ):${model.name}
        delete${model.name}(where: ${model.name}WhereUniqueInput!):${model.name}
    }
  ${"`"}
  `;

  // Devuelve el nombre del modelo y el modelo GraphQL
  return { name: model.name, model: gqlModel };
};

// Exporta la función
export { generateSchemaObject };
