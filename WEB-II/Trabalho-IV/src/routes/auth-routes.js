import z from "zod";
import { Router } from "express";

import { validarBody } from "../middlewares/validar-body.js";

import {
  login,
  register,
  verificacaoEmail,
} from "../controllers/auth-controllers.js";

export const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gerenciamento de autenticação
 */

const userSchema = z.object({
  nome: z
    .string({ required_error: "O nome é obrigatório" })
    .min(3, "O nome deve conter no mínimo 3 caracteres"),
  email: z
    .string({ required_error: "O email é obrigatório" })
    .email({ message: "O e-mail deve ser válido" }),
  senha: z
    .string({ required_error: "A senha é obrigatória" })
    .min(6, "A senha deve conter no mínimo 6 caracteres"),
});

/**
 * @openapi
 * /register:
 *   post:
 *     summary: Rota de cadastro de usuário
 *     description: Permite cadastrar um novo usuário no sistema.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do usuário (mínimo de 3 caracteres).
 *                 example: Rafael
 *               email:
 *                 type: string
 *                 description: Email válido do usuário.
 *                 example: rafael@email.com
 *               senha:
 *                 type: string
 *                 description: Senha do usuário (mínimo de 6 caracteres).
 *                 example: senha-muito-segura
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso. Verifique seu email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário registrado com sucesso. Verifique seu email.
 *                 user:
 *                   type: object
 *                   properties:
 *                     nome:
 *                       type: string
 *                       example: Rafael
 *                     email:
 *                       type: string
 *                       example: rafael@email.com
 *       400:
 *         description: Retorna uma mensagem de erro caso os dados sejam inválidos ou o usuário já exista.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Usuário já existe.
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro interno no servidor.
 */
authRouter.post("/register", validarBody(userSchema), register);

const verificacaoSchema = z.object({
  email: z.string(),
  token: z.string(),
});

/**
 * @openapi
 * /verificar-email:
 *   post:
 *     summary: Rota de verificação de email
 *     description: Permite verificar o email do usuário usando um token de verificação.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - token
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário a ser verificado.
 *                 example: rafael@email.com
 *               token:
 *                 type: string
 *                 description: Token de verificação enviado para o email do usuário.
 *                 example: abc123
 *     responses:
 *       200:
 *         description: Email verificado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email verificado com sucesso.
 *       400:
 *         description: Retorna uma mensagem de erro caso o token seja inválido ou o email já tenha sido verificado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Token inválido.
 *       404:
 *         description: Retorna uma mensagem de erro caso o usuário não seja encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Usuário não encontrado.
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro interno no servidor.
 */
authRouter.post(
  "/verificar-email",
  validarBody(verificacaoSchema),
  verificacaoEmail
);

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Rota de login do usuário
 *     description: Permite autenticar um usuário no sistema.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário.
 *                 example: rafael@email.com
 *               senha:
 *                 type: string
 *                 description: Senha do usuário.
 *                 example: senha-muito-segura
 *     responses:
 *       200:
 *         description: Retorna uma mensagem de sucesso e os dados do usuário autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login realizado com sucesso.
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     nome:
 *                       type: string
 *                       example: Rafael
 *                     email:
 *                       type: string
 *                       example: rafael@email.com
 *       400:
 *         description: Retorna uma mensagem de erro caso as credenciais sejam inválidas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Senha inválida.
 *       401:
 *         description: Retorna uma mensagem de erro caso o email não tenha sido confirmado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email não confirmado. Verifique seu email.
 *       404:
 *         description: Retorna uma mensagem de erro caso o usuário não seja encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Usuário não encontrado.
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro interno no servidor.
 */
authRouter.post(
  "/login",
  validarBody(userSchema.partial({ nome: true })),
  login
);
