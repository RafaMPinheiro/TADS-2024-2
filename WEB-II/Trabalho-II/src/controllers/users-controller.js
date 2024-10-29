import { UserDao } from "../models/user-dao.js";
import { User } from "../models/user-model.js";

function listaUsers(req, res) {
  const page = parseInt(req.query.page, 10) || 1;
  const firstUserPage = (page - 1) * 5;
  const search = req.query.search || "";

  const userDao = new UserDao();
  const totalUsers = userDao.getCountUsers(search);
  const totalPages = Math.ceil(totalUsers / 5);
  const usersRaw = userDao.list({ firstUserPage, search });

  const users = usersRaw.map((u) => {
    return new User(
      u.id,
      u.name,
      u.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
      u.email,
      u.phone ? u.phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") : null,
      u.role
    );
  });

  res.render("users-list", {
    users,
    currentPage: page,
    totalUsers,
    totalPages,
    search,
  });
}

function addUserForm(req, res) {
  const data = {
    title: "Add new user",
    action: "/users/addUser",
    method: "POST",
    user: null,
  };

  res.render("users-formulario", { ...data });
}

function addUser(req, res) {
  const userDao = new UserDao();

  const { name, cpf, password } = req.body;

  // Validação de CPF único
  const existingUser = userDao.getByCPF(cpf);
  if (existingUser) {
    return res.status(400).send("CPF já cadastrado.");
  }

  // Definir perfil automaticamente
  const role = cpf.startsWith("1") ? "ADMIN" : "CLIENTE";

  // Inserir usuário
  userDao.save({ name, cpf, password, role });

  res.redirect("/users");
}

function userDetails(req, res) {
  const { id } = req.params;

  const userDao = new UserDao();
  const userRaw = userDao.get({ id });

  const user = new User(
    userRaw[0].id,
    userRaw[0].name,
    userRaw[0].cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
    null,
    null,
    userRaw[0].role
  );

  const emails = userDao.getEmails({ id });
  const phones = userDao.getPhones({ id });

  const data = {
    user,
    emails,
    phones: phones.map((phone) => ({
      id: phone.id,
      phone: phone.phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3"),
      main: phone.main,
      user_id: phone.user_id,
    })),
  };
  console.log({ ...data });

  res.render("user-info", { ...data });
}

function updateUserForm(req, res) {
  const { id } = req.params;

  const userDao = new UserDao();
  const user = userDao.get({ id });

  const data = {
    title: "Update user",
    action: `/users/edit/${id}`,
    method: "UPDATE",
    user,
  };

  res.render("users-formulario", { ...data });
}

function updateUser(req, res) {
  const userDao = new UserDao();

  const { id } = req.params;
  const { name, cpf, email, password, phone, role } = req.body;
  userDao.edit({ id, name, cpf, email, password, phone, role });

  res.redirect("/users");
}

function deleteUser(req, res) {
  const userDao = new UserDao();
  const { id } = req.params;

  const user = userDao.get({ id });

  if (user[0].role === "ADMIN") {
    return res.status(403).send("Não é possível excluir um usuário ADMIN.");
  }

  userDao.remove({ id });
  res.redirect("/users");
}

export {
  listaUsers,
  addUserForm,
  addUser,
  userDetails,
  updateUserForm,
  updateUser,
  deleteUser,
};
