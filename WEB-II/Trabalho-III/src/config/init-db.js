import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function initDB() {
  const userExists = await prisma.user.findFirst({
    where: {
      role: "Super Usuário",
    },
  });
  if (!userExists) {
    await prisma.user.deleteMany();
    await prisma.module.deleteMany();
    await prisma.userModule.deleteMany();

    const moduleExists = await prisma.module.findFirst();
    if (!moduleExists) {
      await prisma.module.createMany({
        data: [
          { name: "Gestão de Usuários", path: "gestaoUsuario" },
          { name: "Perfil", path: "perfil" },
          { name: "Financeiro", path: "financeiro" },
          { name: "Relatorios", path: "relatorios" },
          { name: "Produtos", path: "produtos" },
        ],
      });
    }

    await prisma.user.createMany({
      data: [
        {
          name: "Super Usuário",
          email: "superusuario@gmail.com",
          password: bcrypt.hashSync(
            process.env.HASH_SECRET + "superusuario",
            10
          ),
          role: "Super Usuário",
        },
      ],
    });

    const UserModuleExists = await prisma.userModule.findFirst();
    if (!UserModuleExists) {
      await prisma.UserModule.createMany({
        data: [
          { userId: 1, moduleId: 1 },
          { userId: 1, moduleId: 2 },
          { userId: 1, moduleId: 3 },
          { userId: 1, moduleId: 4 },
          { userId: 1, moduleId: 5 },
        ],
      });
    }
  }
}
