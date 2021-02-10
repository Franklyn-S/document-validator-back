require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const documentRoutes = require("./routes/documentsRoutes");

app.use(
  bodyParser.json({
    limit: "50mb",
    extended: true,
  })
);
app.use("/v1/users", userRoutes);
app.use("/v1/documents", documentRoutes);
app.get("/v1/status", (req, res) => res.send("Working!"));

// Port 8080 for Google App Engine
app.set("port", process.env.APP_PORT || 8080);
app.listen(process.env.APP_PORT || 8080);
