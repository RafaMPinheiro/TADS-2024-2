import { UserDao } from "../models/user-dao.js";

function listaUsers(req, res) {
	const userDao = new UserDao();
	const users = userDao.list();

	const data = {
		title: "WEB II",
		users,
	};
	res.render("users-list", { ...data });
}

export { listaUsers };
