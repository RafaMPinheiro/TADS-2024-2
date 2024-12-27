import express from "express";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

import { authRouter } from "./routes/auth-routes.js";
import { todoRouter } from "./routes/todo-routes.js";
import { categoriasRouter } from "./routes/categorias-routes.js";

const app = express();
app.use(express.json());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trabalho IV",
      version: "0.0.1-SNAPSHOT",
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

app.use(authRouter);
app.use(todoRouter);
app.use(categoriasRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
