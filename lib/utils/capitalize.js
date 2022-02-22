"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unCapitalize = exports.capitalize = void 0;
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.capitalize = capitalize;
function unCapitalize(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
exports.unCapitalize = unCapitalize;
