// Importaciones necesarias
import { GQLModel } from '../types';
import { writeFile } from './writeFile';
import { unCapitalize } from './capitalize';
import path from 'path';

/**
 * Función para crear el archivo base de los resolvers.
 * @param {GQLModel[] | undefined} gqlModels - Modelos de GraphQL.
 */
const createBaseResolversFile = async (gqlModels: GQLModel[] | undefined) => {
  if (gqlModels) {
    // Importaciones de los resolvers
    const resolversImport = gqlModels
      .map((model) => `import { ${unCapitalize(model.name)}Resolvers } from './${model.name.toLowerCase()}/resolvers';`)
      .join('\n');

    // Importaciones de los tipos
    const typesImport = gqlModels
      .map((model) => `import { ${unCapitalize(model.name)}Types } from './${model.name.toLowerCase()}/types';`)
      .join('\n');

    const resolverArray = [
      ...gqlModels
      .map((model) => `${unCapitalize(model.name)}Resolvers`),
      'generalResolvers',
    ].join(',');

    // Array de tipos
    const typesArray = gqlModels
      .map((model) => `${unCapitalize(model.name)}Types`)
      .join(', ');

    const baseFile = `
      // Importaciones de los resolvers
      import { generalResolvers } from './general/resolvers';
      ${resolversImport}

      // Importaciones de los tipos
      import { generalTypes } from './general/types';
      ${typesImport}

      // Array de resolvers
      const resolverArray = [${resolverArray}]
      // Array de tipos
      const typesArray = [
        generalTypes,
        ${typesArray}
      ];
      export {  resolverArray, typesArray };
    `;

    await writeFile(
      path.join(process.cwd(), `prisma/generated/models/index.ts`),
      baseFile
    );
  }
};

export { createBaseResolversFile };
