import express from "express";
import {
  addUserForm,
  addUser,
  listaUsers,
  userDetails,
  updateUserForm,
  updateUser,
  deleteUser,
} from "../controllers/users-controller.js";

const usersRouter = express.Router();

usersRouter.get("/addUser", addUserForm);

usersRouter.post("/addUser", addUser);

usersRouter.get("/users", listaUsers);

usersRouter.get("/user/:id", userDetails);

usersRouter.get("/updateUser/:id", updateUserForm);

usersRouter.post("/updateUser/:id", updateUser);

usersRouter.get("/deleteUser/:id", deleteUser);

export { usersRouter };
