"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTypeObject = void 0;
var generateTypeObject = function (model) {
    //TODO: change query id field
    var gqlFields = model.fields.map(function (field) {
        return "".concat(field.name, ": ").concat(field.gqlType);
    });
    var gqlModel = "\n  import {gql} from 'apollo-server-micro'\n\n  const ".concat(model.name, "Types = gql`\n  type ").concat(model.name, "{\n    ").concat(gqlFields, "\n  }\n\n  type Query{\n    get").concat(model.name, "s:[").concat(model.name, "]\n    get").concat(model.name, "(id:String!):").concat(model.name, "\n  }\n\n  input InputCreate").concat(model.name, "{\n    ").concat(gqlFields.filter(function (f) {
        return ((f.includes('String') ||
            f.includes('Int') ||
            f.includes('Float') ||
            f.includes('Boolean') ||
            f.toLocaleLowerCase().includes('enum') ||
            f.includes('DateTime')) &&
            !f.includes('createdAt') &&
            !f.includes('updatedAt'));
    }), "\n  }\n\n  input InputWhere").concat(model.name, "{\n    id:String!\n  }\n\n  input InputUpdate").concat(model.name, "{\n  ").concat(gqlFields
        .filter(function (f) {
        return ((f.includes('String') ||
            f.includes('Int') ||
            f.includes('Float') ||
            f.includes('Boolean') ||
            f.toLocaleLowerCase().includes('enum') ||
            f.includes('DateTime')) &&
            !f.includes('createdAt') &&
            !f.includes('updatedAt'));
    })
        .map(function (f) {
        return f.replace('!', '');
    })
        .join('\n'), "\n  }\n\n  type Mutation {\n  create").concat(model.name, "(data:InputCreate").concat(model.name, "):").concat(model.name, "\n\n  update").concat(model.name, "(where:InputWhere").concat(model.name, "!, data:InputUpdate").concat(model.name, " ):").concat(model.name, "\n\n  delete").concat(model.name, "(where: InputWhere").concat(model.name, "!):").concat(model.name, "\n\n    }\n  `\n  export {").concat(model.name, "Types}\n    ");
    return { name: model.name, model: gqlModel };
};
exports.generateTypeObject = generateTypeObject;
