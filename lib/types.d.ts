interface PrismaField {
    name: string;
    type: string;
    isId: boolean;
    isArray: boolean;
    required: boolean;
    isUnique: boolean;
    isMoney: boolean;
    gqlType: string;
    isRelatedModel: boolean;
    attributes: string[];
}
interface GQLModel {
    name: string;
    fields: PrismaField[];
}
interface ParsedGQLModel {
    name: string;
    model: string;
}
export { PrismaField, GQLModel, ParsedGQLModel };
