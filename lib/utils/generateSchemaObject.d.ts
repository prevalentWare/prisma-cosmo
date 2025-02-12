import { GQLModel } from '../types';
declare const generateSchemaObject: (model: GQLModel, federated: boolean) => {
    name: string;
    model: string;
};
export { generateSchemaObject };
