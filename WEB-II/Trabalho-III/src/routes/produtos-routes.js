import { Router } from "express";

import { paginaProdutos } from "../controllers/produtos-controller.js";

const router = Router();

router.get("/", paginaProdutos);

export default router;
