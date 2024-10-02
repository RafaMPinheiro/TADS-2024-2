const rotaDinamica = (req, res) => {
	const name = req.params.name;
	const authorization = req.headers.authorization;

	res.send({ authorization, message: `Olá, ${capitalize(name)}!` });
};

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

module.exports = rotaDinamica;
