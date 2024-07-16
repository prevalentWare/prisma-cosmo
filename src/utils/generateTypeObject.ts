// Importaciones necesarias
import { unCapitalize } from './capitalize';
import path from 'path';
import { writeFile } from './writeFile';

// Función para crear la configuración de la sesión
const createTypeObject = async (gqlModels: any, parsedModels: any) => {
  const list: any = [];

  // Recorremos los modelos parseados
  parsedModels.flatMap((model: any) => {
    const relatedFields = model.fields
      .filter((f: any) => {
        if (f.isRelatedModel) return f.name;
      })
      .flatMap((i: any) => {
        list.push(i.name);
        return i.name;
      });
  });

  // Filtramos los elementos únicos
  const unique = list.filter(
    (value: any, index: any, array: any) => array.indexOf(value) === index
  );

  // Creamos el archivo base
  const baseFile = `
  ${parsedModels?.map(
    (model: any) => `
    export type ${model.name} = {
      ${model.fields.map(
        (field: any) => `
      ${field.name}${!field.required ? '?' : ''}: ${field.type.replace(
          'String',
          'string'
        ).replace('DateTime', 'Date').replace(/(Int|Float|Decimal)/, 'number').replace(/(JSON|Json)/, 'Object<any>')}
      `).join(';')}
    }
    export type ${model.name}CreateInput = {
      ${model.fields.filter((field: any) => (!(field.isId || field.isRelatedModel || field.isArray || field.name === 'updatedAt' || field.name === 'createdAt')))
      .map((field: any) => (`
      ${field.name}${!field.required ? '?' : ''}: ${field.type.replace(
          'String',
          'string'
        ).replace('DateTime', 'Date').replace(/(Int|Float|Decimal)/, 'number').replace(/(JSON|Json)/, 'Object<any>')}
      `
  ))}
    }
    export type ${model.name}UpdateInput = {
        ${model.fields.filter((field: any) => (!(field.isId || field.isRelatedModel || field.isArray || field.name === 'updatedAt' || field.name === 'createdAt')))
        .map((field: any) => (`
        ${field.name}?: ${field.type.replace(
            'String',
            'string'
          ).replace('DateTime', 'Date').replace(/(Int|Float|Decimal)/, 'number').replace(/(JSON|Json)/, 'Object<any>')}
        `
    ))}
      }
     export type ${model.name}WhereUniqueInput = {
        ${model.fields.filter((field: any) => (field.isId || field.isUnique))
        .map((field: any) => (`
        ${field.name}?: ${field.type.replace(
            'String',
            'string'
          ).replace('DateTime', 'Date').replace(/(Int|Float|Decimal)/, 'number').replace(/(JSON|Json)/, 'Object<any>')}
        `
    ))}
      }
    `
  ).join(';')}
  `;

  // const baseFile = `
  // export const sessionConfig = {
  //   Parent: [
  //     ${unique.map((i: string) => {
  //       return ` { name: '${i}', roles: ['Admin'], isPublic: false } `;
  //     })}
  //   ],
  //   Mutation: [
  //     ${gqlModels?.map((model: any) => `
  //     // ${model.name}
  //     { name: 'create${model.name}', roles: ['Admin'], isPublic: false },
  //     { name: 'update${model.name}', roles: ['Admin'], isPublic: false },
  //     { name: 'upsert${model.name}', roles: ['Admin'], isPublic: false },
  //     { name: 'delete${model.name}', roles: ['Admin'], isPublic: false }
  //     `)}
  //   ],
  //   Query: [
  //     ${gqlModels?.map((model: any) => `
  //     // ${model.name}
  //     { name: '${unCapitalize(model.name)}s', roles: ['Admin'], isPublic: false },
  //     { name: '${unCapitalize(model.name)}', roles: ['Admin'], isPublic: false }
  //     `)}
  //   ]
  // }`;

  // Escribimos el archivo
  await writeFile(
    path.join(process.cwd(), `prisma/generated/types.ts`),
    baseFile
  );
};

// Exportamos la función
export { createTypeObject };
