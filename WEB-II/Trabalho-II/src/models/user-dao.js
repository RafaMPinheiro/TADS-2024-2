import { db } from "../config/database.js";

export class UserDao {
  get({ id }) {
    const stmt = db.prepare("SELECT * FROM users WHERE users.id = @id");
    const user = stmt.all({ id });

    return user;
  }

  getEmails({ id }) {
    const stmt = db.prepare(
      "SELECT * FROM emails WHERE user_id = @id ORDER BY main DESC"
    );
    const emails = stmt.all({ id });

    return emails;
  }

  getPhones({ id }) {
    const stmt = db.prepare(
      "SELECT * FROM phones WHERE user_id = @id ORDER BY main DESC"
    );
    const phones = stmt.all({ id });

    return phones;
  }

  getCountUsers(search = "") {
    const stmt = db.prepare(`
      SELECT COUNT(*) AS count 
      FROM users
      LEFT JOIN emails ON users.id = emails.user_id AND emails.main = 1
      LEFT JOIN phones ON users.id = phones.user_id AND phones.main = 1
      WHERE users.name LIKE ?
    `);
    const { count } = stmt.get(`%${search}%`);

    return count;
  }

  list({ firstUserPage, search = "" }) {
    const stmt = db.prepare(`
    SELECT users.id, users.cpf, users.name, users.role, 
           COALESCE(emails.email, 'Não informado') AS email, 
           COALESCE(phones.phone, 'Não informado') AS phone
    FROM users 
    LEFT JOIN emails ON users.id = emails.user_id AND emails.main = 1 
    LEFT JOIN phones ON users.id = phones.user_id AND phones.main = 1 
    WHERE users.name LIKE ? 
    LIMIT 5 OFFSET ?
  `);
    const users = stmt.all(`%${search}%`, firstUserPage);

    return users;
  }

  getByCPF(cpf) {
    const stmt = db.prepare("SELECT * FROM users WHERE cpf = @cpf");
    const user = stmt.get({ cpf });
    return user;
  }

  save({ cpf, name, password, role }) {
    const stmt = db.prepare(
      "INSERT INTO users (cpf, name, password, role) VALUES (@cpf, @name, @password, @role)"
    );
    stmt.run({ cpf, name, password, role });
  }

  edit({ id, cpf, name, password, role, email, phone }) {
    let stmt = db.prepare(
      "UPDATE users SET cpf = @cpf, name = @name, password = @password, role = @role WHERE id = @id"
    );
    stmt.run({ cpf, name, password, role, id });

    stmt = db.prepare(
      "UPDATE emails SET email = @email WHERE user_id = @user_id"
    );
    stmt.run({ email, user_id: id });

    stmt = db.prepare(
      "UPDATE phones SET phone = @phone WHERE user_id = @user_id"
    );
    stmt.run({ phone, user_id: id });
  }

  remove({ id }) {
    let stmt = db.prepare("DELETE FROM users WHERE id = @id");
    stmt.run({ id });
  }
}
