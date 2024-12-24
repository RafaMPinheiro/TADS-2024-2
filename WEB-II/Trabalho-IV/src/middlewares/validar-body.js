export const validarBody = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    let errors = error.errors.map((err) => {
      return err.message;
    });

    res.status(400).json({ errors });
  }
};
