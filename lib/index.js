#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cosmo_1 = require("./cosmo");
var commander_1 = require("commander");
var chalk_1 = __importDefault(require("chalk"));
var figlet = __importStar(require("figlet"));
// Console Welcome
// clear();
console.log(chalk_1.default.bold.blueBright(figlet.textSync('Cosmo', { horizontalLayout: 'full' })));
console.log(chalk_1.default.bold.blueBright(figlet.textSync('by', { horizontalLayout: 'fitted' })));
console.log(chalk_1.default.bold.blueBright(figlet.textSync('prevalentWare', { horizontalLayout: 'fitted' })));
var program = new commander_1.Command();
program
    .version('0.0.1')
    .description('A tool that generates Graphql files from the Prisma Schema');
(0, cosmo_1.cosmo)();
