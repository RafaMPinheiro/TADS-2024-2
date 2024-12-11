import { Router } from "express";

import { login, paginaLogin } from "../controllers/auth-controllers.js";

const router = Router();

router.get("/login", paginaLogin);

router.post("/login", login);

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/home");
});

export default router;
