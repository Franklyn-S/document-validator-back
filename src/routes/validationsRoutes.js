const express = require("express");
const router = express.Router();
const validationController = require("../controllers/validationController");

router.post("/", validationController.insert);
router.get("/:fileId", validationController.getValidationsByFileId);
router.delete("/:fileId", validationController.deleteByFileId);

module.exports = router;