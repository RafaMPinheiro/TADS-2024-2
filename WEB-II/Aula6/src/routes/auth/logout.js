import { Router } from "express";

const router = Router();

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/home");
});

export default router;
