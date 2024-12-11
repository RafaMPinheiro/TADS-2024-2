import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function paginaGestaoUsuario(req, res) {
  const usersModules = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      userModule: {
        select: {
          Module: {
            select: {
              id: true,
              name: true,
              path: true,
            },
          },
        },
      },
    },
  });

  const users = usersModules.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    modules: user.userModule.map((userModule) => userModule.Module),
  }));

  res.render("gestao-usuario", { users });
}

async function paginaRegistrarUsuario(req, res) {
  const role = req.session.user.role;

  const modules = await prisma.module.findMany({
    where: {
      name: {
        notIn: ["Perfil", "Gestão de Usuários"],
      },
    },
  });

  if (role === "Super Usuário") {
    return res.render("users-formulario", {
      roles: ["Administrador", "Usuário"],
      modules,
    });
  } else if (role === "Administrador") {
    return res.render("users-formulario", {
      roles: ["Usuário"],
      modules,
    });
  }

  return res.render("acesso-negado", { module: "Registrar Usuário" });
}

const registrarUsuario = async (req, res) => {
  try {
    const { name, email, password, role, modules } = req.body;

    const avatar = req.file.filename;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: bcrypt.hashSync(process.env.HASH_SECRET + password, 10),
        avatar,
        role,
      },
      select: {
        id: true,
      },
    });

    if (role === "Administrador") {
      modules.push("1");
    }

    modules.push("2");

    await prisma.userModule.createMany({
      data: modules.map((module) => ({
        userId: user.id,
        moduleId: Number(module),
      })),
    });

    res.redirect("/gestaoUsuario");
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).send("Erro interno no servidor.");
  }
};

async function paginaPerfil(req, res) {
  const id = req.session.user.userId;

  const userRaw = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
      avatar: true,
      role: true,
      userModule: {
        select: {
          Module: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const user = {
    id,
    name: userRaw.name,
    email: userRaw.email,
    avatar: userRaw.avatar,
    role: userRaw.role,
    modules: userRaw.userModule.map((e) => e.Module.name),
  };

  res.render("perfil", { user });
}

export {
  paginaGestaoUsuario,
  paginaPerfil,
  paginaRegistrarUsuario,
  registrarUsuario,
};
