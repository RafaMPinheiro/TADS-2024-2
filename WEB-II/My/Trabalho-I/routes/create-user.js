const { v4: uuid } = require("uuid");

const dadosPost = (req, res) => {
  const body = req.body;

  const newId = uuid();

  res.send({ ...body, id: newId });
};

module.exports = dadosPost;
