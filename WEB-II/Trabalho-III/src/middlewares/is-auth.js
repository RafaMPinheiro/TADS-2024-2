const isAuth = async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  next();
};

export { isAuth };
