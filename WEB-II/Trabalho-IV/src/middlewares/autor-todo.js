import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const autorTodo = () => async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const todo = await prisma.todo.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        categoria: true,
      },
    });

    if (!todo) {
      res.status(404).json({ error: "Todo não encontrado." });
    }

    const hasAccess =
      todo.userId === usuarioId ||
      todo.categoria.usuariosCompartilhados.some(
        (sharedUser) => sharedUser.userId === usuarioId
      );

    if (!hasAccess) {
      res.status(403).json({ error: "Acesso negado." });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};
