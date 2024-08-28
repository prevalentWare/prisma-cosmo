import { GQLModel } from '../types';
/**
 * Función para crear el archivo base de los resolvers.
 * @param {GQLModel[] | undefined} gqlModels - Modelos de GraphQL.
 */
declare const createBaseResolversFile: (gqlModels: GQLModel[] | undefined) => Promise<void>;
export { createBaseResolversFile };
