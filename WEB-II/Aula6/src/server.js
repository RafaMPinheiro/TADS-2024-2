import express from "express";
import { PrismaClient } from "@prisma/client";
import session from "express-session";
import bcrypt from "bcrypt";
import "dotenv/config";

import { isAuth } from "./middlewares/is-auth.js";

const prisma = new PrismaClient({
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

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const userSession = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  req.session.user = userSession;
  res.redirect("/home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const encrypted = bcrypt.hashSync(password, 10);

  console.log({ name, email, encrypted });

  await prisma.user.create({
    data: {
      name,
      email,
      password: encrypted,
    },
  });

  res.redirect("/login");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/home");
});

app.get("/users", isAuth, async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(3000, () => console.log("Server iniciou na porta 3000"));
