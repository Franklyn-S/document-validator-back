const util = require("util");
const mysql = require("mysql");

// Database Connection for Production

// let config = {
//     user: process.env.SQL_USER,
//     database: process.env.SQL_DATABASE,
//     password: process.env.SQL_PASSWORD,
//     multipleStatements: true,
// }

// if (process.env.CLOUD_SQL_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
//   config.socketPath = `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`;
// }

// let connection = mysql.createConnection(config);

// Database Connection for Development
// const dbSocketPath = process.env.DB_SOCKET_PATH || "/cloudsql";

console.log(process.env.DB_HOST);
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

connection.connect(function (err) {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  console.log("Connected as thread id: " + connection.threadId);
});

function makeDb() {
  return {
    query(sql, args) {
      return util.promisify(connection.query).call(connection, sql, args);
    },
    close() {
      return util.promisify(connection.end).call(connection);
    },
  };
}

module.exports = makeDb;
