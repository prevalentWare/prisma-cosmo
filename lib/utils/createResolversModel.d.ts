import { GQLModel } from '../types';
declare const createResolvers: (model: GQLModel, parsedModels: GQLModel[], federated: boolean) => Promise<void>;
export { createResolvers };
