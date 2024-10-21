import { Router } from "express";
import {
  updateMainEmail,
  deleteEmail,
  addEmail,
} from "../controllers/email-controller.js";

const emailsRouter = Router();

emailsRouter.post("/updateMainEmail", updateMainEmail);
emailsRouter.post("/addEmail", addEmail);
emailsRouter.post("/deleteEmail/:id", deleteEmail);

export { emailsRouter };
