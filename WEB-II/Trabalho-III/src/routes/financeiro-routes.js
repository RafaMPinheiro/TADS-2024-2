import { Router } from "express";

import { paginaFinanceiro } from "../controllers/financeiro-controller.js";

const router = Router();

router.get("/", paginaFinanceiro);

export default router;
