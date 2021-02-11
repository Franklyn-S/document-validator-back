require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const documentRoutes = require("./routes/documentsRoutes");
const validationRoutes = require("./routes/validationsRoutes");

app.use(
  bodyParser.json({
    limit: "50mb",
    extended: true,
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use("/v1/users", userRoutes);
app.use("/v1/documents", documentRoutes);
app.use("/v1/validations", validationRoutes);
app.get("/v1/status", (req, res) => res.send("Working!"));

// Port 8080 for Google App Engine
app.set("port", process.env.APP_PORT || 8080);
app.listen(process.env.APP_PORT || 8080);
