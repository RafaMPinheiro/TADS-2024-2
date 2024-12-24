import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTodo(req, res) {
  try {
    const { titulo, descricao, previsaoConclusao, categoriaId } = req.body;

    const existeCategoria = await prisma.categoria.findFirst({
      where: {
        id: categoriaId,
      },
    });

    if (!existeCategoria) {
      res.status(400).json({ error: "Categoria não encontrada." });
    }

    const todo = await prisma.todo.create({
      data: {
        titulo,
        descricao,
        previsaoConclusao,
        categoriaId,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      message: "Todo registrado com sucesso.",
      todo: {
        titulo: todo.titulo,
        descricao: todo.descricao,
        previsaoConclusao: todo.previsaoConclusao,
        categoriaId: existeCategoria.nome,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

async function deleteTodo(req, res) {
  try {
    const { id } = req.params;

    await prisma.todo.delete({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });

    res.status(200).json({
      message: "Todo deletado com sucesso.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

async function getTodo(req, res) {
  try {
    const { id } = req.params;

    const todo = await prisma.todo.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!todo) {
      return res.status(404).json({ error: "Todo não encontrado." });
    }

    res.status(200).json({
      todo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

async function getTodos(req, res) {
  try {
    const todos = await prisma.todo.findMany({
      where: {
        OR: [
          { userId: usuarioId },
          {
            categoria: {
              usuariosCompartilhados: {
                some: {
                  userId: usuarioId,
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

    res.status(200).json({
      todos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

async function updateTodo(req, res) {
  try {
    const { id } = req.params;
    const { titulo, descricao, previsaoConclusao, concluida, categoriaId } =
      req.body;

    const todo = await prisma.todo.update({
      where: {
        id: parseInt(id),
      },
      data: {
        titulo,
        descricao,
        previsaoConclusao,
        concluida,
        categoriaId,
      },
    });

    res.status(200).json({
      message: "Todo atualizado com sucesso.",
      todo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export { createTodo, deleteTodo, getTodo, getTodos, updateTodo };
