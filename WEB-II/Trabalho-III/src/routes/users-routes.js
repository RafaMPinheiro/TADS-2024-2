import { Router } from "express";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

import {
  paginaGestaoUsuario,
  paginaRegistrarUsuario,
  registrarUsuario,
  paginaGestaoModulos,
  atualizarModulos,
  paginaPerfil,
  atualizarAvatar,
} from "../controllers/users-controller.js";

import { checkPermission } from "../middlewares/check-permissions.js";

const router = Router();

router.get("/gestaoUsuario", checkPermission, paginaGestaoUsuario);

router.get("/registrarUsuario", checkPermission, paginaRegistrarUsuario);

router.post("/registrarUsuario", upload.single("avatar"), registrarUsuario);

router.get("/gestaoModulos/:id", paginaGestaoModulos);

router.post("/atualizarModulos", atualizarModulos);

router.get("/perfil", paginaPerfil);

router.post("/atualizarAvatar", upload.single("avatar"), atualizarAvatar);

export default router;
