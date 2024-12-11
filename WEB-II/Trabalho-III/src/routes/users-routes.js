import { Router } from "express";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

import {
  paginaGestaoUsuario,
  paginaPerfil,
  paginaRegistrarUsuario,
  registrarUsuario,
} from "../controllers/users-controller.js";

import { checkPermission } from "../middlewares/check-permissions.js";

const router = Router();

router.get("/gestaoUsuario", checkPermission, paginaGestaoUsuario);

router.get("/registrarUsuario", checkPermission, paginaRegistrarUsuario);

router.post("/registrarUsuario", upload.single("avatar"), registrarUsuario);

router.get("/perfil", paginaPerfil);

export default router;
