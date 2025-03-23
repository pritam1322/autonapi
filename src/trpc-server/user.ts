import { prisma } from "./prisma";


export const getUserById = async (id: string) => {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch {
      return null;
    }
  };