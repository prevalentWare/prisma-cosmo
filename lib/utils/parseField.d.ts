declare const parseField: (field: string) => {
    gqlType: string;
    isRelatedModel: boolean;
    name: string;
    type: string;
    isId: boolean;
    isArray: boolean;
    required: boolean;
    isUnique: boolean;
    isMoney: boolean;
    attributes: string[];
};
export { parseField };
