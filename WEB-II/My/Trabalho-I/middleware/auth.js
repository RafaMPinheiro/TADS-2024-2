const middlewareAuth = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      const error = new Error("Token não informado");
      error.status = 401;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = middlewareAuth;
