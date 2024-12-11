function paginaFinanceiro(req, res) {
  res.render("financeiro", { user: req.session.user });
}

export { paginaFinanceiro };
