import { Router } from "express";
import bcrypt from "bcrypt";

import { prisma } from "../../server.js";

const router = Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const userSession = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  req.session.user = userSession;
  res.redirect("/home");
});

export default router;
