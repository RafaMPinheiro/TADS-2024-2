import { Router } from "express";

import { paginaAcessoNegado } from "../controllers/acesso-negado-controller.js";

const router = Router();

router.get("/", paginaAcessoNegado);

export default router;
