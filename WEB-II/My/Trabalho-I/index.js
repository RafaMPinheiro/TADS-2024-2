const express = require("express");
const app = express();
app.use(express.json());

const port = 3333;

const boasVindas = require("./routes/1");
const rotaDinamica = require("./routes/2");
const manipulacaoDados = require("./routes/3");
const dadosPost = require("./routes/4");

// Middleware
const middlewareAuth = require("./middleware/auth");
const middlewarePost = require("./middleware/verify-data");

// Rotas
app.get("/", boasVindas);
app.get("/rota-dinamica/:name", middlewareAuth, rotaDinamica);
app.get("/dados", manipulacaoDados);
app.post("/dados", middlewarePost, dadosPost);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).send({
    error: {
      message: err.message,
      status: status,
    },
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
