import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createCategoria(req, res) {
  try {
    const { nome } = req.body;
    const jwtToken = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(jwtToken).id;

    const categoria = await prisma.categoria.create({
      data: {
        nome,
        userId,
      },
    });

    res.status(201).json({
      message: "Categoria criada com sucesso.",
      categoria,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

async function getCategorias(req, res) {
  try {
    const jwtToken = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(jwtToken).id;

    const categorias = await prisma.categoria.findMany({
      where: { userId },
      include: {
        todos: true,
      },
    });

    res.status(200).json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

async function updateCategoria(req, res) {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    const categoria = await prisma.categoria.update({
      where: { id },
      data: { nome },
    });

    res.status(200).json({
      message: "Categoria atualizada com sucesso.",
      categoria,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

async function deleteCategoria(req, res) {
  try {
    const { id } = req.params;

    await prisma.categoria.delete({
      where: { id },
    });

    res.status(200).json({ message: "Categoria removida com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export { createCategoria, getCategorias, updateCategoria, deleteCategoria };
