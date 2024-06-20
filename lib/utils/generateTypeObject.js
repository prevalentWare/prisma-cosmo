"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTypeObject = void 0;
var capitalize_1 = require("./capitalize");
var generateTypeObject = function (model) {
    //TODO: change query id field
    var gqlFields = model.fields.map(function (field) {
        return "".concat(field.name, ": ").concat(field.gqlType);
    });
    var gqlUpdateFields = model.fields
        .filter(function (f) {
        return ([
            'String',
            'Float',
            'Int',
            'Boolean',
            'DateTime',
            'Json',
            'Decimal',
            'Bytes',
        ].includes(f.gqlType.replace('!', '')) ||
            f.gqlType.replace('!', '').toLowerCase().includes('enum')) &&
            f.name !== 'createdAt' &&
            f.name !== 'updatedAt';
    })
        .map(function (field) {
        var fld = field.gqlType.replace('!', '');
        return "".concat(field.name, ": ").concat(fld).concat(!['Json', 'Bytes'].includes(fld) ? 'Input' : '');
    });
    var gqlModel = "\n  import {gql} from 'apollo-server-micro'\n\n  const ".concat(model.name, "Types = gql`\n  type ").concat(model.name, "{\n    ").concat(gqlFields, "\n  }\n\n  type Query{\n    ").concat((0, capitalize_1.unCapitalize)(model.name), "s:[").concat(model.name, "]\n    ").concat((0, capitalize_1.unCapitalize)(model.name), "(id:String!):").concat(model.name, "\n  }\n\n  input ").concat(model.name, "CreateInput{\n    ").concat(gqlFields.filter(function (f) {
        var name = f.split(':')[0];
        var type = f.split(':')[1].trim().replace('!', '');
        return ((type == 'String' ||
            type == 'Int' ||
            type == 'Float' ||
            type == 'Boolean' ||
            type == 'Json' ||
            type == 'Decimal' ||
            type == 'Bytes' ||
            type.toLocaleLowerCase().includes('enum') ||
            type == 'DateTime') &&
            name != 'createdAt' &&
            name != 'updatedAt');
    }), "\n  }\n\n  input ").concat(model.name, "WhereUniqueInput{\n    id:String!\n  }\n\n  input ").concat(model.name, "UpdateInput{\n  ").concat(gqlUpdateFields
        .map(function (f) {
        return f.replace('!', '');
    })
        .join('\n'), "\n  }\n\n  type Mutation {\n  create").concat(model.name, "(data:").concat(model.name, "CreateInput):").concat(model.name, "\n\n  update").concat(model.name, "(where:").concat(model.name, "WhereUniqueInput!, data:").concat(model.name, "UpdateInput ):").concat(model.name, "\n\n  delete").concat(model.name, "(where: ").concat(model.name, "WhereUniqueInput!):").concat(model.name, "\n\n    }\n  `\n  export {").concat(model.name, "Types}\n    ");
    return { name: model.name, model: gqlModel };
};
exports.generateTypeObject = generateTypeObject;
