function paginaProdutos(req, res) {
  res.render("produtos", { user: req.session.user });
}

export { paginaProdutos };
