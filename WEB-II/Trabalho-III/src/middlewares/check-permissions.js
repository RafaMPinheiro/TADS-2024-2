import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const checkPermission = async (req, res, next) => {
  const userModules = await prisma.userModule.findMany({
    where: {
      userId: req.session.user.userId,
    },
    include: {
      Module: true,
    },
  });

  const permissions = userModules.map(({ Module }) => {
    return {
      name: Module.name,
      path: Module.path,
    };
  });

  req.session.user = {
    ...req.session.user,
    permissions,
  };

  const moduleName = req.originalUrl.split("/")[1];
  let hasPermission = permissions.some((p) => p.path === moduleName);

  if (
    moduleName === "registrarUsuario" &&
    req.session.user.role !== "Usuário"
  ) {
    hasPermission = true;
  }

  await prisma.log.create({
    data: {
      User: {
        connect: {
          id: req.session.user.userId,
        },
      },
      action: hasPermission ? "Permitido" : "Negado",
      module: moduleName,
    },
  });

  if (hasPermission) {
    return next();
  }

  return res.render("acesso-negado", { module: moduleName });
};

export { checkPermission };
