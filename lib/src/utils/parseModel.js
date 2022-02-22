"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseModel = void 0;
var parseField_1 = require("./parseField");
var parseModel = function (model) {
    var name = Array.from(model.matchAll(/model (.*) {/g))[0][1];
    var data = model.match(/\{([^{}]+)\}/g);
    var fields = data ? data[0].split('\r') : [];
    var parsedFields = fields
        .map(function (field) {
        return (0, parseField_1.parseField)(field);
    })
        .filter(function (el) { return el.type; });
    return {
        name: name,
        fields: parsedFields,
    };
};
exports.parseModel = parseModel;
