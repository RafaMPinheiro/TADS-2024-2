const rotaDinamica = (req, res, next) => {
  const name = req.params.name;

  res.send({ message: `Olá, ${name}!` });
};

module.exports = rotaDinamica;
