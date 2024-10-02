const array = [
	{ id: "1", name: "João" },
	{ id: "2", name: "Maria" },
	{ id: "3", name: "Ana" },
];

const manipulacaoDados = (req, res, next) => {
	try {
		const id = req.query.id;

		if (!id) {
			const error = new Error("Id não informado!");
			error.status = 400;
			throw error;
		}

		const user = array.find((user) => user.id === id);

		if (!user) {
			const error = new Error("Usuário não encontrado!");
			error.status = 404;
			throw error;
		}

		res.status(200).send(user);
		return;
	} catch (error) {
		next(error);
	}
};

module.exports = manipulacaoDados;
