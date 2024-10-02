const verifyData = (req, res, next) => {
	try {
		const { nome, hobby } = req.body;

		if (!nome || !hobby) {
			const error = new Error("Os dados devem conter nome e hobby!");
			error.status = 400;
			throw error;
		}

		next();
	} catch (error) {
		next(error);
	}
};

module.exports = verifyData;
