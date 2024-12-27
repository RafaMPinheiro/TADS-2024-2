import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const autorTodo = () => async (req, res, next) => {
  try {
    const { id } = req.params;
    const jwtToken = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(jwtToken).id;

    const todo = await prisma.todo.findUnique({
      where: {
        id,
      },
      include: {
        categoria: {
          include: {
            usuariosCompartilhados: true,
          },
        },
      },
    });

    console.log(todo);

    if (!todo) {
      return res.status(404).json({ error: "Todo não encontrado." });
    }

    const hasAccess =
      todo.userId === userId ||
      todo.categoria.usuariosCompartilhados.some(
        (usuario) => usuario.id === userId
      );

    if (!hasAccess) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};
