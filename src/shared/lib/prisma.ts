import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

if (!process.env.DATABASE_URL) {
    console.warn("ADVERTENCIA: DATABASE_URL no está definida en process.env");
}

const prismaClientSingleton = () => {
    return new PrismaClient()
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
