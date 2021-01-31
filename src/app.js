require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");

app.use(bodyParser.json());
app.use("/users", userRoutes);

app.get("/status", (req, res) => res.send("Working!"));

// Port 8080 for Google App Engine
app.set("port", process.env.APP_PORT || 3001);
app.listen(3001);
