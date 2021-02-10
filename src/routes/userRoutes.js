const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.all);
router.post("/", userController.insert);
router.get("/:id", userController.getUserById);
router.get("/username/:username", userController.getUserByUsername);
router.put("/:id", userController.update);
router.delete("/:id", userController.deleteById);

module.exports = router;
