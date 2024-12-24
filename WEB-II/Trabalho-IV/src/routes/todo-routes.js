import z from "zod";
import { Router } from "express";

import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
} from "../controllers/todo-controller.js";

import { validarBody } from "../middlewares/validar-body.js";
import { autorTodo } from "../middlewares/autor-todo.js";

export const todoRouter = Router();

const todoSchema = z.object({
  titulo: z.string().nonempty(),
  descricao: z.string().optional(),
  previsaoConclusao: z.date().optional(),
  concluida: z.boolean().optional(),
  categoriaId: z.number().optional(),
});

/**
 * @openapi
 * /todos:
 *   post:
 *     summary: Rota para criar uma nova tarefa
 *     description: Permite criar uma nova tarefa no sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título da tarefa.
 *                 example: "Comprar leite"
 *               descricao:
 *                 type: string
 *                 description: Descrição da tarefa.
 *                 example: "Comprar leite no supermercado"
 *               previsaoConclusao:
 *                 type: string
 *                 format: date-time
 *                 description: Data prevista para conclusão da tarefa.
 *                 example: "2023-10-30T10:00:00Z"
 *               concluida:
 *                 type: boolean
 *                 description: Indica se a tarefa foi concluída.
 *                 example: false
 *               categoriaId:
 *                 type: integer
 *                 description: ID da categoria da tarefa.
 *                 example: 1
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Todo registrado com sucesso."
 *                 todo:
 *                   type: object
 *                   properties:
 *                     titulo:
 *                       type: string
 *                       example: "Comprar leite"
 *                     descricao:
 *                       type: string
 *                       example: "Comprar leite no supermercado"
 *                     previsaoConclusao:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-30T10:00:00Z"
 *                     categoriaId:
 *                       type: string
 *                       example: "Alimentação"
 *       400:
 *         description: Retorna uma mensagem de erro caso a categoria não seja encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Categoria não encontrada."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno no servidor."
 */
todoRouter.post("/todos", validarBody(todoSchema), createTodo);

/**
 * @openapi
 * /todos/{id}:
 *   delete:
 *     summary: Rota para deletar uma tarefa
 *     description: Permite deletar uma tarefa existente pelo ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa a ser deletada.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Tarefa deletada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Todo deletado com sucesso."
 *       404:
 *         description: Retorna uma mensagem de erro caso a tarefa não seja encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Todo não encontrado."
 *       403:
 *         description: Retorna uma mensagem de erro caso o acesso seja negado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Acesso negado."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno no servidor."
 */

todoRouter.delete("/todos/:id", autorTodo, deleteTodo);

todoRouter.get("/todos", getTodos);

/**
 * @openapi
 * /todos/{id}:
 *   get:
 *     summary: Rota para obter uma tarefa específica
 *     description: Permite obter os detalhes de uma tarefa pelo ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa a ser obtida.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Retorna os detalhes da tarefa.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todo:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     titulo:
 *                       type: string
 *                       example: "Comprar leite"
 *                     descricao:
 *                       type: string
 *                       example: "Comprar leite no supermercado"
 *                     previsaoConclusao:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-30T10:00:00Z"
 *                     concluida:
 *                       type: boolean
 *                       example: false
 *                     categoriaId:
 *                       type: integer
 *                       example: 1
 *       404:
 *         description: Retorna uma mensagem de erro caso a tarefa não seja encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Todo não encontrado."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno no servidor."
 */
todoRouter.get("/todos/:id", getTodo);

/**
 * @openapi
 * /todos/{id}:
 *   put:
 *     summary: Rota para atualizar uma tarefa
 *     description: Permite atualizar os detalhes de uma tarefa existente pelo ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa a ser atualizada.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título da tarefa.
 *                 example: "Comprar leite"
 *               descricao:
 *                 type: string
 *                 description: Descrição da tarefa.
 *                 example: "Comprar leite no supermercado"
 *               previsaoConclusao:
 *                 type: string
 *                 format: date-time
 *                 description: Data prevista para conclusão da tarefa.
 *                 example: "2023-10-30T10:00:00Z"
 *               concluida:
 *                 type: boolean
 *                 description: Indica se a tarefa foi concluída.
 *                 example: false
 *               categoriaId:
 *                 type: integer
 *                 description: ID da categoria da tarefa.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Todo atualizado com sucesso."
 *                 todo:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     titulo:
 *                       type: string
 *                       example: "Comprar leite"
 *                     descricao:
 *                       type: string
 *                       example: "Comprar leite no supermercado"
 *                     previsaoConclusao:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-30T10:00:00Z"
 *                     concluida:
 *                       type: boolean
 *                       example: false
 *                     categoriaId:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Retorna uma mensagem de erro caso a categoria não seja encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Categoria não encontrada."
 *       404:
 *         description: Retorna uma mensagem de erro caso a tarefa não seja encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Todo não encontrado."
 *       403:
 *         description: Retorna uma mensagem de erro caso o acesso seja negado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Acesso negado."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno no servidor."
 */
todoRouter.put("/todos/:id", autorTodo, updateTodo);
