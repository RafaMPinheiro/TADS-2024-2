import { PhoneDao } from "../models/phone-dao.js";

function updateMainPhone(req, res) {
  const phoneDao = new PhoneDao();
  const { userId, phone } = req.body;

  phoneDao.updateMain({ user_id: userId, id: phone });

  res.redirect("/user/" + userId);
}

function deletePhone(req, res) {
  const phoneDao = new PhoneDao();
  const { id } = req.params;

  const phone = phoneDao.findById(id);
  if (!phone) {
    return res.status(404).send("Telefone não encontrado");
  }

  const { user_id: userId } = phone;

  phoneDao.remove({ id });

  res.redirect("/user/" + userId);
}

function addPhone(req, res) {
  const phoneDao = new PhoneDao();
  const { phone, userId } = req.body;

  phoneDao.save({ phone, user_id: userId });

  res.redirect("/user/" + userId);
}

export { updateMainPhone, deletePhone, addPhone };
