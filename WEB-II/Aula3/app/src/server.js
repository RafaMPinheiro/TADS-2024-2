import express from "express";

import { usersRouter } from "./routes/users-routes.js";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "src/views");

app.get("/healthcheck", (req, res) => {
	res.send("OK");
});

app.get("/", (req, res) => res.redirect("/home"));

app.get("/home", (req, res) => {
	res.render('home');
});

app.use("/users", usersRouter);

app.listen(port, () => {
	console.log(`Servidor rodando em http://localhost:${port}`);
});
