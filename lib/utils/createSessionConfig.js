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
        while (_) try {
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
exports.createSessionConfig = void 0;
// Importaciones necesarias
var capitalize_1 = require("./capitalize");
var path_1 = __importDefault(require("path"));
var writeFile_1 = require("./writeFile");
// Función para crear la configuración de la sesión
var createSessionConfig = function (gqlModels, parsedModels) { return __awaiter(void 0, void 0, void 0, function () {
    var list, unique, baseFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                list = [];
                // Recorremos los modelos parseados
                parsedModels.flatMap(function (model) {
                    var relatedFields = model.fields.filter(function (f) {
                        if (f.isRelatedModel)
                            return f.name;
                    }).flatMap(function (i) {
                        list.push(i.name);
                        return i.name;
                    });
                });
                unique = list.filter(function (value, index, array) { return array.indexOf(value) === index; });
                baseFile = "  \n  export const sessionConfig = {\n    Parent: [\n      ".concat(unique.map(function (i) {
                    return " { name: '".concat(i, "', roles: ['Admin'], isPublic: false } ");
                }), "\n    ],\n    Mutation: [ \n      ").concat(gqlModels === null || gqlModels === void 0 ? void 0 : gqlModels.map(function (model) { return "\n      // ".concat(model.name, "\n      { name: 'create").concat(model.name, "', roles: ['Admin'], isPublic: false },\n      { name: 'update").concat(model.name, "', roles: ['Admin'], isPublic: false },\n      { name: 'upsert").concat(model.name, "', roles: ['Admin'], isPublic: false },\n      { name: 'delete").concat(model.name, "', roles: ['Admin'], isPublic: false }\n      "); }), "\n    ],\n    Query: [\n      ").concat(gqlModels === null || gqlModels === void 0 ? void 0 : gqlModels.map(function (model) { return "\n      // ".concat(model.name, "\n      { name: '").concat((0, capitalize_1.unCapitalize)(model.name), "s', roles: ['Admin'], isPublic: false },\n      { name: '").concat((0, capitalize_1.unCapitalize)(model.name), "', roles: ['Admin'], isPublic: false }"); }), ",\n       //General\n      { name: 'getMultipleSignedUrlsForUpload', roles: ['Admin'], isPublic: false },\n      { name: 'getSignedUrlForUpload', roles: ['Admin'], isPublic: false }\n    ]\n  }");
                // Escribimos el archivo
                return [4 /*yield*/, (0, writeFile_1.writeFile)(path_1.default.join(process.cwd(), "prisma/generated/sessionConfig/sessionConfig.ts"), baseFile)];
            case 1:
                // Escribimos el archivo
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.createSessionConfig = createSessionConfig;