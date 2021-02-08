const makeDb = require("../database");
const { Storage } = require("@google-cloud/storage");
const stream = require("stream");
const convertb64StringToBlob = require("../utils");

const db = makeDb();
const storage = new Storage({
  projectId: "document-validator",
  keyFilename: "document-validator-1e8cf051a5e8.json",
});
const bucket = storage.bucket("document-validator");

const documentController = {
  async insert(req, res) {
    const { userId, name, base64 } = req.body;
    const blob = Buffer.from(base64, "base64");
    //const blob = convertb64StringToBlob(base64, "application/pdf");
    const file = bucket.file(`${userId}/${name}`);

    try {
      await file.save(blob);
      const url = await file.getSignedUrl({
        action: "read",
        expires: "03-17-2025",
      });

      await db.query("INSERT INTO document SET ?", {
        userId,
        name,
        url,
      });
      res.send("Documento inserido com sucesso!");
    } catch (err) {
      console.log(err);
      res.status(500).send("Erro ao inserir documento.");
    }
  },
  async deleteById(req, res) {
    const id = req.params.id;
    try {
      await db.query("DELETE FROM document WHERE documentId = ?", id);
      res.send("Documento deletado com sucesso!");
    } catch (err) {
      res.status(500).send("Erro ao deletar documento");
    }
  },
  async getDocumentsByUserId(req, res) {
    const userId = req.params.userId;
    try {
      const documents = await db.query(
        "SELECT * from document WHERE userId = ?",
        userId
      );
      res.json(documents);
    } catch (err) {
      res.status(500).send("Erro ao pegar documentos do usuário");
    }
  },
};

module.exports = documentController;
