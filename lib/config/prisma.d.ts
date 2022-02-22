import { PrismaClient } from '@prisma/client';
declare global {
    var prismaGlobal: PrismaClient;
}
declare let prisma: PrismaClient;
export default prisma;
