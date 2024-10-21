import { Router } from "express";
import {
  updateMainPhone,
  deletePhone,
  addPhone,
} from "../controllers/phone-controller.js";

const phonesRouter = Router();

phonesRouter.post("/updateMainPhone", updateMainPhone);
phonesRouter.post("/addPhone", addPhone);
phonesRouter.post("/deletePhone/:id", deletePhone);

export { phonesRouter };
