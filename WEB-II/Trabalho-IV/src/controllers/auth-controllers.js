import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
import { sendTokenEmail } from "../utils.js";

const prisma = new PrismaClient();

async function register(req, res) {
  try {
    const { nome, email, senha } = req.body;

    const userExists = await prisma.user.findFirst({
      where: { email },
    });

    if (userExists) {
      res.status(400).json({ error: "Usuário já existe." });
    }

    const emailVerificacaoToken = Math.random().toString(36).substr(2, 6);

    await sendTokenEmail(email, emailVerificacaoToken);

    const hashedPassword = bcrypt.hashSync(process.env.HASH_SECRET + senha, 10);
    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        emailVerificacaoToken,
      },
    });

    res.status(201).json({
      message: "Usuário registrado com sucesso. Verifique seu email.",
      user: { nome: user.nome, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

async function verificacaoEmail(req, res) {
  try {
    const { email, token } = req.body;

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
    }

    if (user.emailVerificado) {
      res.status(400).json({ error: "Email já verificado." });
    }

    if (user.emailVerificacaoToken !== token) {
      res.status(400).json({ error: "Token inválido." });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerificado: true },
    });

    res.status(200).json({ message: "Email verificado com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
    }

    const isPasswordValid = bcrypt.compareSync(
      process.env.HASH_SECRET + senha,
      user.senha
    );

    if (!isPasswordValid) {
      res.status(400).json({ error: "Senha inválida." });
    }

    if (!user.emailVerificado) {
      res
        .status(401)
        .json({ error: "Email não confirmado. Verifique seu email." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.TOKEN_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login realizado com sucesso.",
      token,
      user: { id: user.id, nome: user.nome, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export { register, verificacaoEmail, login };
