const connection = require("../database");

const userController = {
  all(_, res) {
    // Return all users
    connection.query("SELECT * FROM user", function (error, results) {
      if (error) throw error;
      res.json(results);
    });
  },
  byId(req, res) {
    // Returns a single user
    const idParam = req.params.id;
    connection.query(
      "SELECT * FROM user WHERE userId = ?",
      idParam,
      function (error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    );
  },
};

module.exports = userController;
