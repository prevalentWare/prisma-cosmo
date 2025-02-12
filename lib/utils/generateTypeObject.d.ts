import { GQLModel } from '../types';
declare const createTypeObject: (parsedModels: GQLModel[] | undefined, enums: string[] | null, federated: boolean) => Promise<void>;
export { createTypeObject };
