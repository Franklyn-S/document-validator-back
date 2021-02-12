// Imports the Google Cloud client library
const { Datastore } = require("@google-cloud/datastore");
const datastore = new Datastore();

const makeDb = require("../database");
const { Storage } = require("@google-cloud/storage");

const db = makeDb();
const storage = new Storage({
  projectId: "document-validator",
  keyFilename: "document-validator-1e8cf051a5e8.json",
});

var sha256 = require("js-sha256");

const bucket = storage.bucket("document-validator");

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

const validationController = {
  async insert(req, res) {
    const { fileId, base64, motivation } = req.body;
    var file_hash = null;
    var contents = null;
    var or_hash = null;

    // Gets hash from base64
    try {
      const file = Buffer.from(base64, "base64");
      file_hash = sha256(file);
    } catch (err) {
      console.log(err);
      res.status(500).send("Erro ao transformar arquivo em hash.");
    }

    // Gets file name and userid from database
    try {
      var userId = null;
      var name = null;
      const document = await db.query(
        "SELECT userId, name FROM document WHERE documentId = ?",
        fileId
      );
      if (isEmptyObject(document)) {
        res.status(200).send("Arquivo não existe");
      } else {
        userId = document[0].userId;
        name = document[0].name;
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .send("Erro ao buscar informações do arquivo no banco de dados");
    }

    // Gets file from google cloud storage and hash it
    try {
      var or_file = bucket.file(`${userId}/${name}`);
      or_hash = await or_file.download().then(function (data) {
        contents = data[0];
        return sha256(contents);
      });
    } catch (err) {
      res.status(500).send("Erro ao buscar arquivo no storage");
    }

    try {
      const kind = "document-validator";
      const name =
        "validation-id-" + Math.floor(Math.random() * (10000 - 1 + 1)) + 1;

      const taskKey = datastore.key([kind, name]);

      // Compare hashes
      if (or_hash === file_hash) {
        const task = {
          key: taskKey,
          data: {
            fileId: fileId,
            date: new Date(),
            result: "True",
            motivation: motivation,
          },
        };
        await datastore.save(task);
        res.status(200).send("Arquivo é o mesmo!");
      } else {
        const task = {
          key: taskKey,
          data: {
            fileId: fileId,
            date: new Date(),
            result: "False",
            motivation: motivation,
          },
        };
        await datastore.save(task);
        res.status(200).send("Arquivo não é o mesmo!");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Falha ao inserir validação no datastore");
    }
  },
  async deleteByFileId(req, res) {
    try {
      const fileId = req.params.fileId;
      const query = datastore
        .createQuery("document-validator")
        .filter("fileId", "=", fileId);
      const [validations] = await datastore.runQuery(query);

      if (isEmptyObject(validations)) {
        res.status(200).send("Não existem validações para esse arquivo");
      }

      validations.forEach(validation =>
        datastore.delete(
          validation[Object.getOwnPropertySymbols(validation)[0]]
        )
      );

      res.status(200).send("Validações removidas");
    } catch (err) {
      res.status(500).send("Falha ao pegar validações no datastore");
    }
  },
  async getValidationsByFileId(req, res) {
    try {
      const fileId = req.params.fileId;
      const query = datastore
        .createQuery("document-validator")
        .filter("fileId", "=", fileId);
      const [validations] = await datastore.runQuery(query);

      if (isEmptyObject(validations)) {
        res.status(200).send("Não existem validações para esse arquivo");
      }

      res.status(200).json(validations);
    } catch (err) {
      res.status(500).send("Falha ao pegar validações no datastore");
    }
  },
};

module.exports = validationController;
