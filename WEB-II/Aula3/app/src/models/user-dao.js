import { User } from "./user-model.js";

export class UserDao {
	list() {
		return [
			new User("Rafael"),
			new User("Mary"),
			new User("Manu"),
			new User("Vini"),
		];
	}
}
