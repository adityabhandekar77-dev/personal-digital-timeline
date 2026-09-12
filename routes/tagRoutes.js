const express = require("express");
const tagController = require("../controllers/tagController");
const validateTag = require("../middleware/validateTag");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.use(authenticateToken);

router.get("/", tagController.getAllTags);
router.post("/", validateTag, tagController.createTag);

module.exports = router;