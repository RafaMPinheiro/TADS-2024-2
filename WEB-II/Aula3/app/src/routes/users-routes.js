import { Router } from "express";

import { listaUsers } from "../controllers/users-controller.js";

const usersRouter = Router();

usersRouter.get("/", listaUsers);

usersRouter.get("/add", (req, res) => {
	res.send("Form add user");
});

usersRouter.post("/add", (req, res) => {
	res.send("After form user");
});

export { usersRouter };
