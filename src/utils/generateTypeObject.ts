import path from 'path';
import { writeFile } from './writeFile';
import { GQLModel, PrismaField } from '../types';

// Función para crear el string del tipo único
const getModelUniqueFields = (uniqueFields: PrismaField[]) => {
  if (uniqueFields.length === 1) {
    return `${uniqueFields[0].name}: ${uniqueFields[0].type
      .replace('String', 'string')
      .replace('DateTime', 'Date')
      .replace(/(Int|Float|Decimal)/, 'number')
      .replace(/(JSON|Json)/, 'Object<any>')}`;
  }
  return uniqueFields.map(field => `
    ${field.name}: ${field.type
      .replace('String', 'string')
      .replace('DateTime', 'Date')
      .replace(/(Int|Float|Decimal)/, 'number')
      .replace(/(JSON|Json)/, 'Object<any>')}`).join('');
};

// Función para crear los campos de un modelo
const getModelFields = (fields: PrismaField[]) => fields.map(field => `
  ${field.name}${!field.required ? '?' : ''}: ${field.type
    .replace('String', 'string')
    .replace('DateTime', 'Date')
    .replace(/(Int|Float|Decimal)/, 'number')
    .replace(/(JSON|Json)/, 'Object<any>')}`).join(';');

// Función para crear los campos de entrada
const getModelCreateInputFields = (fields: PrismaField[]) => fields.filter(field => !(
  field.isId ||
  field.isRelatedModel ||
  field.isArray ||
  field.name === 'updatedAt' ||
  field.name === 'createdAt'
)).map(field => `
  ${field.name}${!field.required ? '?' : ''}: ${field.type
    .replace('String', 'string')
    .replace('DateTime', 'Date')
    .replace(/(Int|Float|Decimal)/, 'number')
    .replace(/(JSON|Json)/, 'Object<any>')}`).join('');

const getModelUpdateInputFields = (fields: PrismaField[]) => fields.filter(field => !(
  field.isId ||
  field.isRelatedModel ||
  field.isArray ||
  field.name === 'updatedAt' ||
  field.name === 'createdAt'
)).map(field => `
  ${field.name}?: ${field.type
    .replace('String', 'string')
    .replace('DateTime', 'Date')
    .replace(/(Int|Float|Decimal)/, 'number')
    .replace(/(JSON|Json)/, 'Object<any>')}`).join('');

// Función principal para crear la configuración de la sesión
const createTypeObject = async (parsedModels: GQLModel[] | undefined, enums: string[] | null) => {
  // Construimos la línea de importación para los enums
  const enumsString = enums ? enums.map((e) => e.replace('enum ', '')).join(', ') : '';

  // Creamos el archivo base
  const baseFile = `
  ${enumsString ? `import { ${enumsString} } from '@prisma/client';` : ''}
  ${parsedModels?.map(model => {
    const uniqueFields = model.fields.filter(field => field.isId || field.isUnique);
    const uniqueFieldsString = getModelUniqueFields(uniqueFields);
    const fieldsString = getModelFields(model.fields);
    const createInputFieldsString = getModelCreateInputFields(model.fields);
    const updateInputFieldsString = getModelUpdateInputFields(model.fields);


    return `
      export type ${model.name} = {
        ${fieldsString}
      }
      export type ${model.name}CreateInput = {
        data: {
          ${createInputFieldsString}
        }
      }
      export type ${model.name}UpdateInput = {
        where: { id: string }
        data: {
          ${updateInputFieldsString}
        }
      }
      export type ${model.name}WhereDeleteInput = {
        where: {
          ${uniqueFieldsString}
        }
      }
      export type ${model.name}WhereUniqueInput = {
        ${uniqueFieldsString}
      }
    `;
  }).join('')}
  `;

  // Escribimos el archivo
  await writeFile(
    path.join(process.cwd(), `prisma/generated/types.ts`),
    baseFile
  );
};

// Exportamos la función
export { createTypeObject };
