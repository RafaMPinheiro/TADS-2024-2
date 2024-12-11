import express from "express";
import { PrismaClient } from "@prisma/client";
import session from "express-session";
import bcrypt from "bcrypt";
import "dotenv/config";

import { isAuth } from "./middlewares/is-auth.js";
import loginRoutes from "./routes/auth/login.js";
import logoutRoute from "./routes/auth/logout.js";
import usersRoutes from "./routes/users/register.js";

export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(
  session({
    secret: process.env.SECRET_WORD,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use((req, res, next) => {
  req.session.routes = req.session.routes ?? [];
  req.session.routes.push(req.url);
  next();
});

app.use((req, res, next) => {
  console.log("Middleware");
  console.log({
    url: req.url,
    method: req.method,
    body: req.body,
    query: req.query,
    session: req.session,
  });
  next();
});

app.set("view engine", "ejs");
app.set("views", "src/views");

app.get("/healthcheck", (req, res) => {
  res.send("OK");
});

app.get("/", (req, res) => res.redirect("/home"));

app.get("/home", (req, res) => {
  res.render("home", { user: req.session.user });
});

app.use(loginRoutes);
app.use(logoutRoute);
app.use("/users", usersRoutes);

app.get("/users", isAuth, async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(3000, () => console.log("Server iniciou na porta 3000"));
