"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFile = void 0;
var fs_1 = __importDefault(require("fs"));
var util_1 = require("util");
var writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
exports.writeFile = writeFile;
