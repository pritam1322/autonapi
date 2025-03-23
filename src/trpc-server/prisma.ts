import { PrismaClient } from "@prisma/client";


// Create a Prisma client instance and ensure only one instance is created (important for Next.js hot reloading)
const prisma = new PrismaClient();

export { prisma }; 