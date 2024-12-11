import fs from "fs";
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

  res.render("gestao-usuario", { users, userSession: req.session.user });
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
    const { name, email, password, role, modules: rawModules } = req.body;

    let modules = rawModules;

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

    if (role === "Usuário") {
      modules = rawModules.filter((module) => module !== "1");
    }

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

async function paginaGestaoModulos(req, res) {
  const userRaw = await prisma.user.findUnique({
    where: {
      id: Number(req.params.id),
    },
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
            },
          },
        },
      },
    },
  });

  const userModulesIds = userRaw.userModule.map((e) => e.Module.id);

  const modulesRaw = await prisma.module.findMany({
    where: {
      name: {
        notIn: ["Perfil", "Gestão de Usuários"],
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const modules = modulesRaw.map((module) => ({
    ...module,
    checked: userModulesIds.includes(module.id),
  }));

  const user = {
    id: userRaw.id,
    name: userRaw.name,
    email: userRaw.email,
    avatar: userRaw.avatar,
    role: userRaw.role,
  };

  console.log({ user, modules });

  res.render("gestao-modulos", { user, modules });
}

async function atualizarModulos(req, res) {
  const { id, modules } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      role: true,
    },
  });

  await prisma.userModule.deleteMany({
    where: {
      userId: Number(id),
    },
  });

  if (user.role !== "Administrador") {
    modules.filter((module) => module !== "1");
  }

  await prisma.userModule.createMany({
    data: modules.map((module) => ({
      userId: Number(id),
      moduleId: Number(module),
    })),
  });

  res.redirect("/gestaoUsuario");
}

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

async function atualizarAvatar(req, res) {
  const id = req.session.user.userId;

  const avatar = req.file.filename;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      avatar: true,
    },
  });

  if (user.avatar) {
    fs.unlink(`uploads/${user.avatar}`, (err) => {
      if (err) {
        console.error("Erro ao deletar avatar antigo:", err);
      }
    });
  }

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      avatar,
    },
  });

  res.redirect("/perfil");
}

export {
  paginaGestaoUsuario,
  paginaRegistrarUsuario,
  registrarUsuario,
  paginaGestaoModulos,
  atualizarModulos,
  paginaPerfil,
  atualizarAvatar,
};
