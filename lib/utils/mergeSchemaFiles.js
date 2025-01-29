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
exports.cleanGeneratedSchema = exports.mergeSchemaFiles = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var util_1 = require("util");
var readFile = (0, util_1.promisify)(fs_1.default.readFile);
var writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
var unlink = (0, util_1.promisify)(fs_1.default.unlink);
var getSchemaInfo = function () {
    var prismaDir = path_1.default.join(process.cwd(), 'prisma');
    var schemaDir = path_1.default.join(prismaDir, 'schema');
    var targetFile = path_1.default.join(prismaDir, 'schema.prisma');
    // Check if schema directory exists
    if (!fs_1.default.existsSync(schemaDir)) {
        // If no schema directory, check if there's a single schema.prisma file
        if (fs_1.default.existsSync(targetFile)) {
            return {
                hasMultipleSchemas: false,
                isGenerated: false,
                schemaFiles: ['schema.prisma'],
            };
        }
        throw new Error('No schema files found');
    }
    // Read all .prisma files from the schema directory
    var schemaFiles = fs_1.default
        .readdirSync(schemaDir)
        .filter(function (file) { return file.endsWith('.prisma'); });
    return {
        hasMultipleSchemas: schemaFiles.length > 1 ||
            (schemaFiles.length === 1 && schemaFiles[0] !== 'schema.prisma'),
        isGenerated: schemaFiles.length > 1 ||
            (schemaFiles.length === 1 && schemaFiles[0] !== 'schema.prisma'),
        schemaFiles: schemaFiles,
    };
};
var mergeSchemaFiles = function () { return __awaiter(void 0, void 0, void 0, function () {
    var prismaDir, schemaDir, targetFile, _a, hasMultipleSchemas, schemaFiles, mergedContent;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                prismaDir = path_1.default.join(process.cwd(), 'prisma');
                schemaDir = path_1.default.join(prismaDir, 'schema');
                targetFile = path_1.default.join(prismaDir, 'schema.prisma');
                _a = getSchemaInfo(), hasMultipleSchemas = _a.hasMultipleSchemas, schemaFiles = _a.schemaFiles;
                // If no multiple schemas, no need to merge
                if (!hasMultipleSchemas) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Promise.all(schemaFiles.map(function (file) { return __awaiter(void 0, void 0, void 0, function () {
                        var content;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, readFile(path_1.default.join(schemaDir, file), 'utf-8')];
                                case 1:
                                    content = _a.sent();
                                    return [2 /*return*/, "// --- ".concat(file, " ---\n").concat(content, "\n")];
                            }
                        });
                    }); }))];
            case 1:
                mergedContent = _b.sent();
                // Write merged content to schema.prisma
                return [4 /*yield*/, writeFile(targetFile, mergedContent.join('\n'), 'utf-8')];
            case 2:
                // Write merged content to schema.prisma
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.mergeSchemaFiles = mergeSchemaFiles;
var cleanGeneratedSchema = function () { return __awaiter(void 0, void 0, void 0, function () {
    var prismaDir, targetFile, isGenerated;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                prismaDir = path_1.default.join(process.cwd(), 'prisma');
                targetFile = path_1.default.join(prismaDir, 'schema.prisma');
                isGenerated = getSchemaInfo().isGenerated;
                if (!(isGenerated && fs_1.default.existsSync(targetFile))) return [3 /*break*/, 2];
                return [4 /*yield*/, unlink(targetFile)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
exports.cleanGeneratedSchema = cleanGeneratedSchema;
