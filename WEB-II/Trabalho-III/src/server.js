import express from "express";
import session from "express-session";
import dotenv from "dotenv";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

if (process.env.NODE_ENV === "development") {
  console.log("Running in development mode");
  dotenv.config({ path: ".env.development" });
} else if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode");
  dotenv.config({ path: ".env.production" });
}

console.log({
  ENV: process.env.NODE_ENV,
  APP_SECRET: process.env.APP_SECRET,
  HASH_SECRET: process.env.HASH_SECRET,
});

const app = express();
app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.APP_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get("/healthcheck", (req, res) => {
  res.send("OK");
});

app.get("/", (req, res) => res.redirect("/home"));

app.get("/home", isAuth, async (req, res) => {
  const usersModules = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      userModule: {
        select: {
          Module: {
            select: {
              id: true,
              name: true,
              path: true,
            },
          },
        },
      },
    },
  });

  const users = usersModules.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    modules: user.userModule.map((userModule) => userModule.Module),
  }));

  res.render("home", { user: req.session.user, users });
});

import { isAuth } from "./middlewares/is-auth.js";
import { checkPermission } from "./middlewares/check-permissions.js";

import authRouter from "./routes/auth-routes.js";
import usersRouter from "./routes/users-routes.js";
import financeiroRouter from "./routes/financeiro-routes.js";
import relatoriosRouter from "./routes/relatorios-routes.js";
import produtosRouter from "./routes/produtos-routes.js";

app.use("/", authRouter);
app.use("/", isAuth, usersRouter);
app.use("/financeiro", isAuth, checkPermission, financeiroRouter);
app.use("/relatorios", isAuth, checkPermission, relatoriosRouter);
app.use("/produtos", isAuth, checkPermission, produtosRouter);

import { initDB } from "./config/init-db.js";

await initDB();

app.listen(3000, () => console.log("Server iniciou na porta 3000"));
