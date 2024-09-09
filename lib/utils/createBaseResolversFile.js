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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBaseResolversFile = void 0;
var writeFile_1 = require("./writeFile");
var capitalize_1 = require("./capitalize");
var path_1 = __importDefault(require("path"));
/**
 * Función para crear el archivo base de los resolvers.
 * @param {GQLModel[] | undefined} gqlModels - Modelos de GraphQL.
 */
var createBaseResolversFile = function (gqlModels) { return __awaiter(void 0, void 0, void 0, function () {
    var resolversImport, typesImport, resolverArray, typesArray, baseFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!gqlModels) return [3 /*break*/, 2];
                resolversImport = gqlModels
                    .map(function (model) { return "import { ".concat((0, capitalize_1.unCapitalize)(model.name), "Resolvers } from './").concat(model.name.toLowerCase(), "/resolvers';"); })
                    .join('\n');
                typesImport = gqlModels
                    .map(function (model) { return "import { ".concat((0, capitalize_1.unCapitalize)(model.name), "Types } from './").concat(model.name.toLowerCase(), "/types';"); })
                    .join('\n');
                resolverArray = __spreadArray(__spreadArray([], gqlModels
                    .map(function (model) { return "".concat((0, capitalize_1.unCapitalize)(model.name), "Resolvers"); }), true), [
                    'generalResolvers',
                ], false).join(',');
                typesArray = gqlModels
                    .map(function (model) { return "".concat((0, capitalize_1.unCapitalize)(model.name), "Types"); })
                    .join(', ');
                baseFile = "\n      import { withSessionCheck } from '../auth/withSessionCheck';\n      import { Enum_ResolverType, Resolver } from '@/types';\n\n      // Importaciones de los resolvers\n      import { generalResolvers } from './general/resolvers';\n      ".concat(resolversImport, "\n\n      // Importaciones de los tipos\n      import { generalTypes } from './general/types';\n      ").concat(typesImport, "\n\n      // Array de resolvers\n      const resolverArray = [").concat(resolverArray, "].map((el) => {\n        const mappedResolver: Resolver = { Query: {}, Mutation: {} };\n        Object.keys(el).forEach((key) => {\n          const resolverObj = el[key];\n          let resolverName = Enum_ResolverType.Parent;\n          if (key === 'Query') resolverName = Enum_ResolverType.Query;\n          if (key === 'Mutation') resolverName = Enum_ResolverType.Mutation;\n\n          Object.keys(resolverObj).forEach((resolverKey) => {\n            resolverObj[resolverKey] = withSessionCheck(\n              resolverObj[resolverKey],\n              resolverKey,\n              resolverName\n            );\n          });\n          mappedResolver[key] = resolverObj;\n        });\n        return el;\n      });\n\n      // Array de tipos\n      const typesArray = [\n        generalTypes,\n        ").concat(typesArray, "\n      ];\n\n      export {  resolverArray, typesArray };\n    ");
                return [4 /*yield*/, (0, writeFile_1.writeFile)(path_1.default.join(process.cwd(), "prisma/generated/models/index.ts"), baseFile)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
exports.createBaseResolversFile = createBaseResolversFile;
