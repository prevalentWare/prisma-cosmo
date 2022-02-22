"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma;
// check to use this workaround only in development and not in production
if (process.env.NODE_ENV === 'production') {
    prisma = new client_1.PrismaClient();
}
else {
    if (!global.prismaGlobal) {
        global.prismaGlobal = new client_1.PrismaClient();
    }
    prisma = global.prismaGlobal;
}
exports.default = prisma;
