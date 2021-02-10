const makeDb = require("../database");
const { Storage } = require("@google-cloud/storage");

const db = makeDb();
const storage = new Storage({
  projectId: "document-validator",
  keyFilename: "document-validator-1e8cf051a5e8.json",
});

const userController = {
  async all(_, res) {
    let users = [];
    try {
      users = await db.query("SELECT * FROM user");
      let phones = [];
      try {
        Promise.all(
          users.map(async user => {
            phones = await db.query(
              "SELECT phoneId, phoneNumber FROM phone WHERE userId = ?",
              user.userId
            );
            return { ...user, phones };
          })
        ).then(result => {
          res.json(result);
        });
      } catch (error) {
        res.status("500").send("Erro ao buscar telefones.");
      }
    } catch (err) {
      res.status("500").send("Erro ao buscar usuários.");
    }
  },
  async getUserById(req, res) {
    const idParam = req.params.id;
    try {
      const [user] = await db.query(
        "SELECT * FROM user WHERE userId = ?",
        idParam
      );
      const phones = await db.query(
        "SELECT phoneId, phoneNumber FROM phone WHERE userId = ?",
        idParam
      );
      res.json({ ...user, phones });
    } catch (err) {
      res.status("500").send("Erro ao buscar usuário.");
    }
  },
  async getUserByUsername(req, res) {
    const username = req.params.username;
    try {
      const [user] = await db.query(
        "SELECT * FROM user WHERE username = ?",
        username
      );
      const phones = await db.query(
        "SELECT phoneId, phoneNumber FROM phone WHERE userId = ?",
        user.userId
      );
      res.json({ ...user, phones });
    } catch (err) {
      res.status("500").send("Erro ao buscar usuário.");
    }
  },
  async insert(req, res) {
    const { fullName, username, password, email, phones } = req.body;
    try {
      const userResult = await db.query("INSERT INTO user SET ?", {
        fullName,
        username,
        password,
        email,
      });
      const userId = userResult.insertId;
      if (phones.length > 0) {
        let insertPhonesSql = "INSERT INTO phone (userId, phoneNumber) VALUES ";
        phones.forEach(phone => {
          insertPhonesSql += `(${userId}, ${phone}),`;
        });
        await db.query(insertPhonesSql.slice(0, -1));
      }
      res.send("Usuário inserido com sucesso!");
    } catch (err) {
      res.status(500).send("Erro ao inserir usuário");
    }
  },
  async deleteById(req, res) {
    const id = req.params.id;
    try {
      const documents = await db.query(
        "SELECT userId, name FROM document WHERE userId = ?",
        id
      );
      console.log(documents);
      documents.forEach(({ name }) => {
        let file = storage.bucket("document-validator").file(`${id}/${name}`);
        console.log(file);
        if (file) {
          file.delete();
        }
      });
      await db.query("DELETE FROM user WHERE userId = ?", id);
      res.send("Usuário deletado com sucesso!");
    } catch (err) {
      res.status(500).send("Erro ao deletar usuário");
    }
  },
  async update(req, res) {
    const userId = req.params.id;
    const { fullName, username, password, email, phones } = req.body;
    try {
      await db.query("UPDATE user SET ? WHERE userId = ?", [
        { fullName, username, password, email },
        userId,
      ]);
      phones.forEach(async ({ phoneId, phoneNumber }) => {
        await db.query("UPDATE phone SET phoneNumber = ? WHERE phoneId = ?", [
          phoneNumber,
          phoneId,
        ]);
      });
      res.send("Usuário editado com sucesso!");
    } catch (err) {
      res.status("500").send("Erro ao atualizar o usuário.");
    }
  },
};

module.exports = userController;
