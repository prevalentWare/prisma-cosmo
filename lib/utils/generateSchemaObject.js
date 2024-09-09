"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSchemaObject = void 0;
var capitalize_1 = require("./capitalize");
// Función para generar el esquema del objeto
var generateSchemaObject = function (model) {
    // Lista para almacenar los nombres de los campos
    var listNames = [];
    // Mapeo de los campos del modelo
    var gqlFields = model.fields.map(function (field) {
        // Busca si el atributo tiene un valor por defecto
        var found = field.attributes.find(function (element) {
            if (element.includes("@default")) {
                return element;
            }
        });
        // Si el campo tiene un valor por defecto y no es 'id' ni 'createdAt', se añade a la lista
        if (found && field.name != 'id' && field.name != 'createdAt') {
            listNames.push(field.name);
        }
        // Reemplaza los tipos de datos por su equivalente en GraphQL
        field.gqlType = field.gqlType.replace("DateTime", "DateTime");
        field.gqlType = field.gqlType.replace("Json", "JSON");
        // Devuelve el campo con su tipo de dato
        return "".concat(field.name, ": ").concat(field.gqlType);
    });
    // Filtra y mapea los campos que se pueden actualizar
    var gqlUpdateFields = model.fields
        .filter(function (f) {
        return ([
            'String',
            'Float',
            'Int',
            'Boolean',
            'DateTime',
            'JSON',
            'Decimal',
        ].includes(f.gqlType.replace('!', '')) ||
            f.gqlType.replace('!', '').toLowerCase().includes('enum')) &&
            f.name !== 'createdAt' &&
            f.name !== 'updatedAt';
    })
        .map(function (field) {
        var fld = field.gqlType.replace('!', '');
        return "".concat(field.name, ": ").concat(fld).concat(fld !== 'Json' ? '' : '');
    });
    // Genera el modelo GraphQL
    var gqlModel = "\n  import gql from 'graphql-tag';\n\n  export const ".concat((0, capitalize_1.unCapitalize)(model.name), "Types = gql ").concat("`", "\n\n    type ").concat(model.name, "{\n      ").concat(gqlFields, "\n    }\n\n    input ").concat(model.name, "CreateInput{\n      ").concat(gqlFields.filter(function (f) {
        var name = f.split(':')[0];
        var type = f.split(':')[1].trim().replace('!', '');
        var found = listNames.find(function (element) {
            if (element.includes(name)) {
                return element;
            }
        });
        return ((type == 'String' ||
            type == 'Int' ||
            type == 'Float' ||
            type == 'Boolean' ||
            type == 'JSON' ||
            type == 'Decimal' ||
            type.toLocaleLowerCase().includes('enum') ||
            type == 'DateTime') &&
            name != 'createdAt' &&
            name != 'updatedAt' &&
            name != found);
    }), "\n    }\n    input ").concat(model.name, "WhereUniqueInput{\n      id:String!\n    }\n    input ").concat(model.name, "UpdateInput{\n    ").concat(gqlUpdateFields
        .map(function (f) {
        return f.replace('!', '');
    }), "\n    }\n    type Query{\n      ").concat((0, capitalize_1.unCapitalize)(model.name), "s:[").concat(model.name, "]\n      ").concat((0, capitalize_1.unCapitalize)(model.name), "(id:String!):").concat(model.name, "\n    }\n    type Mutation {\n        create").concat(model.name, "(data:").concat(model.name, "CreateInput):").concat(model.name, "\n        update").concat(model.name, "(where:").concat(model.name, "WhereUniqueInput!, data:").concat(model.name, "UpdateInput ):").concat(model.name, "\n        delete").concat(model.name, "(where: ").concat(model.name, "WhereUniqueInput!):").concat(model.name, "\n    }\n  ").concat("`", "\n  ");
    // Devuelve el nombre del modelo y el modelo GraphQL
    return { name: model.name, model: gqlModel };
};
exports.generateSchemaObject = generateSchemaObject;
