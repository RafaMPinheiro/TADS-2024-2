import { db } from "../config/database.js";

export class PhoneDao {
  save({ phone, user_id }) {
    let stmt = db.prepare(
      "INSERT INTO phones (phone, user_id) VALUES (@phone, @user_id)"
    );
    stmt.run({ phone, user_id });
  }

  updateMain({ user_id, id }) {
    let stmt = db.prepare(
      "UPDATE phones SET main = 0 WHERE user_id = @user_id"
    );
    stmt.run({ user_id });

    stmt = db.prepare(
      "UPDATE phones SET main = 1 WHERE id = @id AND user_id = @user_id"
    );
    stmt.run({ id, user_id });
  }

  remove({ id }) {
    let stmt = db.prepare("DELETE FROM phones WHERE id = @id");
    stmt.run({ id });
  }

  findById(id) {
    const stmt = db.prepare("SELECT * FROM phones WHERE id = @id");
    return stmt.get({ id });
  }
}
