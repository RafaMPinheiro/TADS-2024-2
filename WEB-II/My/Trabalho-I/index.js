const express = require("express");
const app = express();
app.use(express.json());

const boasVindas = require("./routes/saudacoes");
const rotaDinamica = require("./routes/saudacoes-dinamico");
const manipulacaoDados = require("./routes/get-user");
const dadosPost = require("./routes/create-user");

const middlewareAuth = require("./middleware/auth");
const middlewarePost = require("./middleware/verify-data");

app.get("/", boasVindas);
app.get("/rota-dinamica/:name", middlewareAuth, rotaDinamica);
app.get("/dados", manipulacaoDados);
app.post("/dados", middlewarePost, dadosPost);

app.use((err, req, res, next) => {
	const status = err.status || 500;
	res.status(status).send({
		error: {
			message: err.message,
			status: status,
		},
	});
});

const port = 3333;
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
