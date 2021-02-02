const connection = require("../database");

const phoneController = {
  getPhoneById(req, res) {
    const userId = req.params.id;
    connection.query(
      "SELECT phoneNumber FROM phone WHERE userId = ?",
      userId,
      (err, results) => {
        if (err) throw err;
        res.send(results);
      }
    );
  },
};

module.exports = phoneController;
