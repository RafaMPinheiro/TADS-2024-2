function paginaRelatorios(req, res) {
  res.render("relatorio", { user: req.session.user });
}

export { paginaRelatorios };
