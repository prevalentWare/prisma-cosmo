"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTypeObject = void 0;
var path_1 = __importDefault(require("path"));
var writeFile_1 = require("./writeFile");
// Función para crear el string del tipo único
var getModelUniqueFields = function (uniqueFields) {
    if (uniqueFields.length === 1) {
        return "".concat(uniqueFields[0].name, ": ").concat(uniqueFields[0].type
            .replace('String', 'string')
            .replace('DateTime', 'Date')
            .replace(/(Int|Float|Decimal)/, 'number')
            .replace('Boolean', 'boolean')
            .replace(/(JSON|Json)/, 'Object<any>'));
    }
    return uniqueFields
        .map(function (field) { return "\n    ".concat(field.name, ": ").concat(field.type
        .replace('String', 'string')
        .replace('DateTime', 'Date')
        .replace(/(Int|Float|Decimal)/, 'number')
        .replace('Boolean', 'boolean')
        .replace(/(JSON|Json)/, 'Object<any>')); })
        .join('');
};
// Función para crear los campos de un modelo
var getModelFields = function (fields) {
    return fields
        .map(function (field) { return "\n  ".concat(field.name).concat(!field.required ? '?' : '', ": ").concat(field.type
        .replace('String', 'string')
        .replace('DateTime', 'Date')
        .replace(/(Int|Float|Decimal)/, 'number')
        .replace('Boolean', 'boolean')
        .replace(/(JSON|Json)/, 'Object<any>')); })
        .join(';');
};
// Función para crear los campos de entrada
var getModelCreateInputFields = function (fields) {
    return fields
        .filter(function (field) {
        return !(field.isId ||
            field.isRelatedModel ||
            field.isArray ||
            field.name === 'updatedAt' ||
            field.name === 'createdAt');
    })
        .map(function (field) { return "\n  ".concat(field.name).concat(!field.required ? '?' : '', ": ").concat(field.type
        .replace('String', 'string')
        .replace('DateTime', 'Date')
        .replace(/(Int|Float|Decimal)/, 'number')
        .replace('Boolean', 'boolean')
        .replace(/(JSON|Json)/, 'Object<any>')); })
        .join('');
};
var getModelUpdateInputFields = function (fields) {
    return fields
        .filter(function (field) {
        return !(field.isId ||
            field.isRelatedModel ||
            field.isArray ||
            field.name === 'updatedAt' ||
            field.name === 'createdAt');
    })
        .map(function (field) { return "\n  ".concat(field.name, "?: ").concat(field.type
        .replace('String', 'string')
        .replace('DateTime', 'Date')
        .replace(/(Int|Float|Decimal)/, 'number')
        .replace('Boolean', 'boolean')
        .replace(/(JSON|Json)/, 'Object<any>')); })
        .join('');
};
// Función principal para crear la configuración de la sesión
var createTypeObject = function (parsedModels, enums) { return __awaiter(void 0, void 0, void 0, function () {
    var enumsString, baseFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                enumsString = enums
                    ? enums.map(function (e) { return e.replace('enum ', ''); }).join(', ')
                    : '';
                baseFile = "\n  ".concat(enumsString ? "import { ".concat(enumsString, " } from '@prisma/client';") : '', "\n  ").concat(parsedModels === null || parsedModels === void 0 ? void 0 : parsedModels.map(function (model) {
                    var uniqueFields = model.fields.filter(function (field) { return field.isId || field.isUnique; });
                    var uniqueFieldsString = getModelUniqueFields(uniqueFields);
                    var fieldsString = getModelFields(model.fields);
                    var createInputFieldsString = getModelCreateInputFields(model.fields);
                    var updateInputFieldsString = getModelUpdateInputFields(model.fields);
                    return "\n      export type ".concat(model.name, " = {\n        ").concat(fieldsString, "\n      }\n      export type ").concat(model.name, "CreateInput = {\n        data: {\n          ").concat(createInputFieldsString, "\n        }\n      }\n      export type ").concat(model.name, "UpdateInput = {\n        where: { id: string }\n        data: {\n          ").concat(updateInputFieldsString, "\n        }\n      }\n      export type ").concat(model.name, "WhereDeleteInput = {\n        where: {\n          ").concat(uniqueFieldsString, "\n        }\n      }\n      export type ").concat(model.name, "WhereUniqueInput = {\n        ").concat(uniqueFieldsString, "\n      }\n    ");
                }).join(''), "\n  ");
                // Escribimos el archivo
                return [4 /*yield*/, (0, writeFile_1.writeFile)(path_1.default.join(process.cwd(), "prisma/generated/types.ts"), baseFile)];
            case 1:
                // Escribimos el archivo
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.createTypeObject = createTypeObject;
