import { Router } from "express";

import { paginaRelatorios } from "../controllers/relatorios-controller.js";

const router = Router();

router.get("/", paginaRelatorios);

export default router;
