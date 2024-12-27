import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTodo(req, res) {
  try {
    const { titulo, descricao, previsaoConclusao, categoriaId } = req.body;
    const jwtToken = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(jwtToken).id;

    if (categoriaId) {
      const existeCategoria = await prisma.categoria.findFirst({
        where: {
          id: categoriaId,
        },
      });

      if (!existeCategoria) {
        return res.status(400).json({ error: "Categoria não encontrada." });
      }

      const todo = await prisma.todo.create({
        data: {
          titulo,
          descricao,
          previsaoConclusao,
          categoriaId,
          userId,
        },
      });

      return res.status(201).json({
        message: "Todo registrado com sucesso.",
        todo: {
          titulo: todo.titulo,
          descricao: todo.descricao,
          previsaoConclusao: todo.previsaoConclusao,
          categoriaId: existeCategoria.nome,
        },
      });
    }

    const todo = await prisma.todo.create({
      data: {
        titulo,
        descricao,
        previsaoConclusao,
        userId,
      },
    });

    return res.status(201).json({
      message: "Todo registrado com sucesso.",
      todo: {
        titulo: todo.titulo,
        descricao: todo.descricao,
        previsaoConclusao: todo.previsaoConclusao,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}

async function deleteTodo(req, res) {
  try {
    const { id } = req.params;

    await prisma.todo.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Todo deletado com sucesso.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}

async function getTodos(req, res) {
  try {
    const jwtToken = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(jwtToken).id;

    const todos = await prisma.todo.findMany({
      where: {
        OR: [
          { userId },
          {
            categoria: {
              usuariosCompartilhados: {
                some: {
                  userId,
                },
              },
            },
          },
        ],
      },
      include: {
        categoria: true,
      },
    });

    return res.status(200).json({
      todos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}

async function updateTodo(req, res) {
  try {
    const { id } = req.params;
    const { titulo, descricao, previsaoConclusao, concluida, categoriaId } =
      req.body;

    const todo = await prisma.todo.update({
      where: {
        id: id,
      },
      data: {
        titulo,
        descricao,
        previsaoConclusao,
        concluida,
        categoriaId,
      },
    });

    return res.status(200).json({
      message: "Todo atualizado com sucesso.",
      todo,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export { createTodo, deleteTodo, getTodos, updateTodo };
