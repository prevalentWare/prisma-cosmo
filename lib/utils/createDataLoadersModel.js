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
exports.createDataLoaders = void 0;
var capitalize_1 = require("./capitalize");
var writeFile_1 = require("./writeFile");
var path_1 = __importDefault(require("path"));
function betweenMarkers(text, begin, end) {
    if (text) {
        var firstChar = text.indexOf(begin) + begin.length;
        var lastChar = text.indexOf(end);
        var newText = text.substring(firstChar, lastChar);
        return newText;
    }
}
// Extraer el nombre de la relación del atributo
var getRelationName = function (attribute) {
    var regex = /@relation\((name:)?\s?"(.*?)"\)/;
    var match = attribute.match(regex);
    return match ? match[2] : '';
};
// Obtener el campo de relación a partir de los atributos
var getRelationField = function (attributes, relationName) {
    var regex = new RegExp("@relation\\((?:name:s?)?\"".concat(relationName, "\".*?fields:\\[(.*?)\\]"));
    for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
        var attr = attributes_1[_i];
        if (attr) {
            var match = attr.match(regex);
            if (match) {
                return match[1];
            }
        }
    }
    return '';
};
var createDataLoaders = function (model, parsedModels) { return __awaiter(void 0, void 0, void 0, function () {
    var relatedFields, listTypes, resolverFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                relatedFields = model.fields.filter(function (f) { return f.isRelatedModel; });
                listTypes = [];
                resolverFile = "\n    import { default as DataLoader } from 'dataloader';\n    import { ".concat(relatedFields
                    .map(function (i) { return i.type.charAt(0).toUpperCase() + i.type.slice(1); })
                    .filter(function (value, index, array) { return array.indexOf(value) === index; }), "} from '@prisma/client'\n    import { getDB } from '@/db';\n\n    ").concat(relatedFields
                    .map(function (rf) {
                    var _a, _b;
                    if (rf.isArray) {
                        var relatedModel = parsedModels.filter(function (pm) { return pm.name === rf.type; })[0];
                        var relatedModelRelation = relatedModel.fields.filter(function (fld) { return fld.type === model.name; })[0];
                        if (relatedModelRelation.isArray) {
                            // many to many
                            return "\n          // Loader para la relaci\u00F3n muchos a muchos\n          const ".concat(rf.name, "Loader = () =>\n          async (ids: readonly string[]): Promise<(").concat(rf.type.charAt(0).toUpperCase() + rf.type.slice(1), " | undefined)[]> => {\n            const db = await getDB()\n            const ").concat(rf.name, "= await db.").concat((0, capitalize_1.unCapitalize)(relatedModel.name), ".findMany({\n                    where: {\n                      ").concat(relatedModelRelation.name, ": {\n                        some: {\n                          id: { in: [...ids] }\n                        },\n                      },\n                    },\n                    include: {\n                      ").concat(relatedModelRelation.name, ": {\n                          select: {\n                              id: true\n                          }\n                      }\n                    }\n                  });\n                  return ids.map((id) => {\n                    const list: any = []\n                    ").concat(rf.name, ".find((").concat(rf.name, ") => {\n                        return ").concat(rf.name, ".").concat(relatedModelRelation.name, ".some((i) => {\n                                if (i.id === id) {list.push(").concat(rf.name, ")}\n                            });\n                        });\n                        return list\n                      })\n                    }\n          ");
                        }
                        else {
                            // one to many
                            var attribute = relatedModel.fields
                                .filter(function (f) { return f.type === model.name; })
                                .map(function (f) { return f.attributes[0]; });
                            var fields = attribute.map(function (attr) {
                                var regex = /fields:\[(.*?)\]/;
                                var match = regex.exec(attr);
                                return match && match[1];
                            });
                            listTypes.push(rf.type.charAt(0).toUpperCase() + rf.type.slice(1));
                            var field_1 = getRelationField(attribute, getRelationName((_a = rf.attributes[0]) !== null && _a !== void 0 ? _a : ''));
                            var relatedFieldName = ((_b = relatedModel === null || relatedModel === void 0 ? void 0 : relatedModel.fields.find(function (f) {
                                return field_1 && f.attributes.some(function (attr) { return attr.includes(field_1); });
                            })) === null || _b === void 0 ? void 0 : _b.name) || '';
                            return "\n              // Loader para la relaci\u00F3n uno a muchos\n              const ".concat(rf.name, "Loader = () => async (ids: readonly string[]): Promise<(").concat(rf.type.charAt(0).toUpperCase() + rf.type.slice(1), "[] | undefined)[]> => {\n                const db = await getDB()\n                const ").concat(rf.name, "= await db.").concat((0, capitalize_1.unCapitalize)(rf.type), ".findMany({\n                          where: {\n                              ").concat(relatedFieldName
                                ? relatedFieldName
                                : relatedModel.fields.filter(function (f) { return f.type === model.name; })[0].name, ": {\n                                is: {\n                                  id: { in: [...ids] },\n                                },\n                              },\n                          },\n                      })\n                      return ids.map((id)=>{\n                        return ").concat(rf.name, ".filter(i => i.").concat(field_1 ? field_1 : fields[0], " == id)\n                      })\n              }");
                        }
                    }
                    else if (
                    // many to one
                    rf.attributes.length > 0 &&
                        rf.attributes[0].includes('fields')) {
                        var relatedField = betweenMarkers(rf.attributes[0], 'fields:[', ']');
                        return "\n        // Loader para la relaci\u00F3n muchos a uno\n          const ".concat(rf.name, "Loader = () => async (ids: readonly string[]): Promise<(").concat(rf.type.charAt(0).toUpperCase() + rf.type.slice(1), " | undefined)[]> => {\n            const db = await getDB()\n            const ").concat(rf.name, "=  await db.").concat((0, capitalize_1.unCapitalize)(rf.type), ".findMany({\n                        where: {\n                          id: { in: [...ids] },\n                        },\n                    });\n                    return ids.map((id) => {\n                      return ").concat(rf.name, ".find(").concat(rf.name, " => ").concat(rf.name, ".id == id)\n                    })\n                  }\n            ");
                    }
                    else {
                        // one to one
                        if (rf.attributes.length > 0) {
                            var relationName_1 = rf.attributes
                                .filter(function (a) { return a.includes('@relation'); })[0]
                                .split('"')[1];
                            var relatedField_1 = model.fields.filter(function (f) {
                                return f.attributes.filter(function (a) { return a.includes(relationName_1); }).length > 0;
                            })[0];
                            var relatedModel = parsedModels.filter(function (pm) { return pm.name === relatedField_1.type; })[0];
                            var relatedModelRelation = relatedModel.fields.filter(function (fld) { return fld.type === model.name; })[0];
                            var relationFieldName = betweenMarkers(relatedModelRelation.attributes
                                .filter(function (a) { return a.includes('@relation'); })[0]
                                .split(',')
                                .filter(function (a) { return a.includes('fields'); })[0], 'fields:[', ']');
                            return "\n          // Loader para la relaci\u00F3n uno a uno\n          const ".concat(rf.name, "Loader = () => async (ids: readonly string[]): Promise<(").concat(rf.type.charAt(0).toUpperCase() + rf.type.slice(1), " | undefined)[]> => {\n            const db = await getDB()\n            const ").concat(rf.name, "=await db.").concat((0, capitalize_1.unCapitalize)(rf.type), ".findMany({\n                    where:{\n                      ").concat(relationFieldName, ":{in:[...ids]}\n                    }\n                  })\n                  return ids.map((id) => {\n                    return ").concat(rf.name, ".find(").concat(rf.name, " => ").concat(rf.name, ".id == id)\n                  })\n                }");
                        }
                        else {
                            return "\n          const ".concat(rf.name, "Loader = () => async (ids: readonly string[]): Promise<(").concat(rf.type.charAt(0).toUpperCase() + rf.type.slice(1), " | undefined)[]> => {\n            const db = await getDB()\n            const ").concat(rf.name, "= await db.").concat((0, capitalize_1.unCapitalize)(rf.type), ".findMany({\n                    where:{\n                      ").concat((0, capitalize_1.unCapitalize)(model.name), "Id:{in:[...ids]}\n                    }\n                  })\n                  return ids.map((id) => {\n                    return ").concat(rf.name, ".find(").concat(rf.name, " => ").concat(rf.name, ".").concat((0, capitalize_1.unCapitalize)(model.name), "Id == id)\n                  })\n          }");
                        }
                    }
                })
                    .join(''), "\n\n    const ").concat((0, capitalize_1.unCapitalize)(model.name), "DataLoader =  {\n      ").concat(relatedFields.map(function (i) {
                    var typeName = i.type.charAt(0).toUpperCase() + i.type.slice(1);
                    var verifyTypo = listTypes.find(function (i) { return i == typeName; });
                    verifyTypo == typeName ? (typeName = typeName + '[]') : typeName;
                    return "\n        ".concat(i.name, "Loader: new DataLoader <string,").concat(typeName, " | undefined>(").concat(i.name, "Loader())");
                }), "\n      };\n      export { ").concat((0, capitalize_1.unCapitalize)(model.name), "DataLoader };\n  ");
                return [4 /*yield*/, (0, writeFile_1.writeFile)(path_1.default.join(process.cwd(), "prisma/generated/models/".concat(model.name.toLowerCase(), "/dataLoaders.ts")), resolverFile)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.createDataLoaders = createDataLoaders;
