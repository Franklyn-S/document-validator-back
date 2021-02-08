const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");

router.get("/:userId", documentController.getDocumentsByUserId);
router.post("/", documentController.insert);
router.delete("/:id", documentController.deleteById);

module.exports = router;
