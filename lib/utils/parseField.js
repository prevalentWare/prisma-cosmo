"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseField = void 0;
var typeMapping = function (field) {
    var mappedType = field.type;
    var isRelatedModel = true;
    if (field.type) {
        if (field.isId) {
            mappedType = 'ID';
        }
        if (field.isArray) {
            mappedType = "[".concat(mappedType, "]");
        }
        if (!field.isArray && field.required) {
            mappedType = "".concat(mappedType, "!");
        }
        if (['String', 'Float', 'Int', 'DateTime', 'Boolean', 'Json', 'Decimal'].includes(field.type) ||
            field.type.toLowerCase().includes('enum')) {
            isRelatedModel = false;
        }
    }
    return __assign(__assign({}, field), { gqlType: mappedType, isRelatedModel: isRelatedModel });
};
var parseField = function (field) {
    var _a;
    var _b = field
        .trim()
        .replace(/\t/g, '')
        .replace(/:\s/g, ':')
        .replace(/,\s/g, ',')
        .replace(/\s+/g, ' ')
        .split(' '), name = _b[0], type = _b[1], attributes = _b.slice(2);
    var finalType = type === null || type === void 0 ? void 0 : type.replace('?', '').replace('[', '').replace(']', '');
    return typeMapping({
        name: name,
        type: finalType,
        required: (_a = !(type === null || type === void 0 ? void 0 : type.includes('?'))) !== null && _a !== void 0 ? _a : false,
        isArray: type === null || type === void 0 ? void 0 : type.includes('['),
        isId: attributes.includes('@id'),
        isUnique: attributes.includes('@unique'),
        isMoney: attributes.includes('@Money'),
        gqlType: '',
        isRelatedModel: false,
        attributes: attributes,
    });
};
exports.parseField = parseField;
