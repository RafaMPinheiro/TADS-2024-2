import bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function paginaLogin(req, res) {
  res.render("login", { error: null });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.render("login", { error: "Credenciais inválidas" });
  }

  const isValid = bcrypt.compareSync(
    process.env.HASH_SECRET + password,
    user.password
  );
  if (!isValid) {
    return res.render("login", { error: "Credenciais inválidas" });
  }

  const userModules = await prisma.userModule.findMany({
    where: {
      userId: user.id,
    },
    include: {
      Module: true,
    },
  });

  const userSession = {
    userId: user.id,
    name: user.name,
    role: user.role,
    permissions: userModules.map(({ Module }) => {
      return {
        name: Module.name,
        path: Module.path,
      };
    }),
  };

  req.session.user = userSession;
  res.redirect("/home");
}

export { paginaLogin, login };
