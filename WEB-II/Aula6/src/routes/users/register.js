import { Router } from "express";
import bcrypt from "bcrypt";

import { prisma } from "../../server.js";

const router = Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const encrypted = bcrypt.hashSync(password, 10);

  console.log({ name, email, encrypted });

  await prisma.user.create({
    data: {
      name,
      email,
      password: encrypted,
    },
  });

  res.redirect("/login");
});

export default router;
