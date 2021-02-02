const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const phoneController = require("../controllers/phoneController");

router.get("/", userController.all);
router.get("/:id", userController.getUserById);
router.get("/:id/phones", phoneController.getPhoneById);
router.post("/", userController.insert);
router.put("/:id", userController.update);
router.delete("/:id", userController.deleteById);

module.exports = router;
