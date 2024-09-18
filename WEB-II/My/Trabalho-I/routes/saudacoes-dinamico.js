const rotaDinamica = (req, res) => {
	const name = req.params.name;

	res.send({ message: `Olá, ${name}!` });
};

module.exports = rotaDinamica;
