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
app.use("/users", userRoutes);
app.use("/documents", documentRoutes);
app.use("/validations", validationRoutes);

app.get("/status", (req, res) => res.send("Working!"));

// Port 8080 for Google App Engine
app.set("port", process.env.APP_PORT || 8080);
app.listen(process.env.APP_PORT || 8080);
