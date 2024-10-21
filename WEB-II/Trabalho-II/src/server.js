import express from "express";
import { usersRouter } from "./routes/users-routes.js";
import { emailsRouter } from "./routes/emails-routes.js";
import { phonesRouter } from "./routes/phones-routes.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "src/views");

app.get("/healthcheck", (req, res) => res.send("OK"));

app.get("/", (req, res) => res.redirect("/users"));

app.use("/", usersRouter);

app.use("/emails", emailsRouter);
app.use("/phones", phonesRouter);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
