const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");

router.post("/", documentController.insert);
router.delete("/:id", documentController.deleteById);
router.get("/:userId", documentController.getDocumentsByUserId);

module.exports = router;
