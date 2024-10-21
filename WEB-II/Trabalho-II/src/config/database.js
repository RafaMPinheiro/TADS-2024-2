import Database from "better-sqlite3";

const db = new Database("dados.db", {
  verbose: console.log,
});

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cpf TEXT NOT NULL UNIQUE CHECK (length(cpf) == 11),
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'CLIENTE' CHECK (role IN ('ADMIN', 'CLIENTE'))
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    main INTEGER NOT NULL DEFAULT 0 CHECK (main IN (0, 1)),
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS phones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL UNIQUE CHECK (length(phone) == 11),
    main INTEGER NOT NULL DEFAULT 0 CHECK (main IN (0, 1)),
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )
`);

const userExists = db.prepare("SELECT COUNT(*) as count FROM users").get();

if (userExists.count === 0) {
  db.exec(`
    INSERT INTO users (cpf, name, password, role)
    VALUES
      ('12345678901', 'John Doe', 'password123', 'CLIENTE'),
      ('23456789012', 'Jane Smith', 'securepass', 'CLIENTE'),
      ('34567890123', 'Alice Johnson', 'mypassword', 'CLIENTE'),
      ('45678901234', 'Bob Brown', 'password123', 'ADMIN'),
      ('56789012345', 'Carol White', '123password', 'CLIENTE'),
      ('67890123456', 'David Black', 'mypassword', 'CLIENTE'),
      ('78901234567', 'Eve Green', 'securepass', 'CLIENTE'),
      ('89012345678', 'Frank Orange', 'password123', 'CLIENTE'),
      ('90123456789', 'Grace Blue', 'securepass', 'ADMIN'),
      ('01234567890', 'Henry Pink', 'mypassword', 'CLIENTE'),
      ('11234567890', 'Ivy Red', 'securepass', 'CLIENTE'),
      ('21234567890', 'Jack Yellow', 'password123', 'CLIENTE');
  `);
}

const emailExists = db.prepare("SELECT COUNT(*) as count FROM emails").get();

if (emailExists.count === 0) {
  db.exec(`
    INSERT INTO emails (email, main, user_id)
    VALUES
      ('john.doe@example.com', 1, 1),
      ('teste@example.com', 0, 1),
      ('jane.smith@example.com', 1, 2),
      ('alice.johnson@example.com', 1, 3),
      ('bob.brown@example.com', 1, 4),
      ('carol.white@example.com', 1, 5),
      ('david.black@example.com', 1, 6),
      ('eve.green@example.com', 1, 7),
      ('frank.orange@example.com', 1, 8),
      ('grace.blue@example.com', 1, 9),
      ('henry.pink@example.com', 1, 10),
      ('ivy.red@example.com', 1, 11),
      ('jack.yellow@example.com', 1, 12);
  `);
}

const phoneExists = db.prepare("SELECT COUNT(*) as count FROM phones").get();

if (phoneExists.count === 0) {
  db.exec(`
    INSERT INTO phones (phone, main, user_id)
    VALUES
      ('11987654321', 1, 1),
      ('11987654329', 0, 1),
      ('21987654321', 1, 2),
      ('31987654321', 1, 3),
      ('41987654321', 1, 4),
      ('51987654321', 1, 5),
      ('61987654321', 1, 6),
      ('71987654321', 1, 7),
      ('81987654321', 1, 8),
      ('91987654321', 1, 9),
      ('11987654322', 1, 10),
      ('21987654322', 1, 11),
      ('31987654322', 1, 12);
  `);
}

export { db };
