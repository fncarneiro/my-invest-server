import { env } from 'process';
import prisma from '@prisma/client';
const { PrismaClient } = prisma;

const url = env.DATABASE_URL;

const connection = new PrismaClient({
    datasources: {
        db: { url: url }
    },
    log: ["error", "info", "query", "warn"],
});

connection.$on('beforeExit', async () => {
    console.log('Shutting down DB Server')
    await connection.$disconnect();
})

export default connection;
