const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.all);
router.get("/:id", userController.byId);

module.exports = router;
