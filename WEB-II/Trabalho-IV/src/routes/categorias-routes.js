import z from "zod";
import { Router } from "express";

import {
  createCategoria,
  deleteCategoria,
  getCategorias,
  updateCategoria,
} from "../controllers/categoria-controllers.js";

import { validarBody } from "../middlewares/validar-body.js";

export const categoriasRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Gerenciamento de categorias
 */

const categoriasSchema = z.object({
  nome: z.string().nonempty(),
});

/**
 * @openapi
 * /categorias:
 *   post:
 *     summary: Cria uma nova categoria
 *     description: Adiciona uma nova categoria associada ao usuário autenticado.
 *     tags: [Categorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome da categoria.
 *                 example: "Trabalho"
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoria criada com sucesso."
 *                 categoria:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "abc123"
 *                     nome:
 *                       type: string
 *                       example: "Trabalho"
 *       500:
 *         description: Erro interno no servidor.
 */
categoriasRouter.post(
  "/categorias",
  validarBody(categoriasSchema),
  createCategoria
);

/**
 * @openapi
 * /categorias:
 *   get:
 *     summary: Lista todas as categorias
 *     description: Retorna todas as categorias associadas ao usuário autenticado.
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "abc123"
 *                   nome:
 *                     type: string
 *                     example: "Trabalho"
 *       500:
 *         description: Erro interno no servidor.
 */
categoriasRouter.get("/categorias", getCategorias);

/**
 * @openapi
 * /categorias/{id}:
 *   put:
 *     summary: Atualiza uma categoria
 *     description: Atualiza o nome de uma categoria pelo ID.
 *     tags: [Categorias]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "abc123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Novo nome da categoria.
 *                 example: "Lazer"
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso.
 *       404:
 *         description: Categoria não encontrada.
 */
categoriasRouter.put(
  "/categorias/:id",
  validarBody(categoriasSchema),
  updateCategoria
);

/**
 * @openapi
 * /categorias/{id}:
 *   delete:
 *     summary: Remove uma categoria
 *     description: Remove uma categoria pelo ID.
 *     tags: [Categorias]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "abc123"
 *     responses:
 *       200:
 *         description: Categoria removida com sucesso.
 *       404:
 *         description: Categoria não encontrada.
 */
categoriasRouter.delete("/categorias/:id", deleteCategoria);
