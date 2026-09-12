const express = require("express");
const timelineController = require("../controllers/timelineController");
const validateId = require("../middleware/validateId");
const validateTimelineEntry = require("../middleware/validateTimelineEntry");
const asyncHandler = require("../middleware/asyncHandler");
const authenticateToken = require("../middleware/authenticateToken");
const validatePagination = require("../middleware/validatePagination");
const tagController = require("../controllers/tagController");

const router = express.Router();

router.use(authenticateToken);

router.get("/", validatePagination, asyncHandler(timelineController.getAllEntries));
router.post("/", validateTimelineEntry, asyncHandler(timelineController.createEntry));

router.post("/:id/tags", validateId, asyncHandler(tagController.addTagToEntry));
router.delete("/:id/tags/:tagId", validateId, asyncHandler(tagController.removeTagFromEntry));

router.get("/:id", validateId, asyncHandler(timelineController.getEntryById));
router.put("/:id", validateId, validateTimelineEntry, asyncHandler(timelineController.updateEntry));
router.delete("/:id", validateId, asyncHandler(timelineController.deleteEntry));

module.exports = router;