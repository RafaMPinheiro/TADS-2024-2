import { EmailDao } from "../models/email-dao.js";

function updateMainEmail(req, res) {
  const emailDao = new EmailDao();
  const { userId, email } = req.body;

  emailDao.updateMain({ user_id: userId, id: email });

  res.redirect("/user/" + userId);
}

function deleteEmail(req, res) {
  const emailDao = new EmailDao();
  const { id } = req.params;

  const email = emailDao.findById(id);
  if (!email) {
    return res.status(404).send("Email não encontrado");
  }

  const { user_id: userId } = email;

  emailDao.remove({ id });

  res.redirect("/user/" + userId);
}

function addEmail(req, res) {
  const emailDao = new EmailDao();
  const { email, userId } = req.body;

  emailDao.save({ email, user_id: userId });

  res.redirect("/user/" + userId);
}

export { updateMainEmail, deleteEmail, addEmail };
