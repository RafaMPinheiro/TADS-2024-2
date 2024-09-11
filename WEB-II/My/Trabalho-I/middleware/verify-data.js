const verifyData = (req, res, next) => {
  try {
    const body = req.body;

    if (!body.nome || !body.hobby) {
      const error = new Error("Está faltando dados!");
      error.status = 401;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = verifyData;
