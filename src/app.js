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
app.use("/users", userRoutes);
app.use("/documents", documentRoutes);

app.get("/status", (req, res) => res.send("Working!"));

// Port 8080 for Google App Engine
app.set("port", process.env.APP_PORT || 3001);
app.listen(3001);
