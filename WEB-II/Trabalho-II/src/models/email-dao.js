import { db } from "../config/database.js";

export class EmailDao {
  save({ email, user_id }) {
    let stmt = db.prepare(
      "INSERT INTO emails (email, user_id) VALUES (@email, @user_id)"
    );
    stmt.run({ email, user_id });
  }

  updateMain({ user_id, id }) {
    let stmt = db.prepare(
      "UPDATE emails SET main = 0 WHERE user_id = @user_id"
    );
    stmt.run({ user_id });

    stmt = db.prepare(
      "UPDATE emails SET main = 1 WHERE id = @id AND user_id = @user_id"
    );
    stmt.run({ id, user_id });
  }

  remove({ id }) {
    let stmt = db.prepare("DELETE FROM emails WHERE id = @id");
    stmt.run({ id });
  }

  findById(id) {
    const stmt = db.prepare("SELECT * FROM emails WHERE id = @id");
    return stmt.get({ id });
  }
}
