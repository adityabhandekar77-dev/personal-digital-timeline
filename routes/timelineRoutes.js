const express = require("express");
const timelineController = require("../controllers/timelineController");
const validateId = require("../middleware/validateId");
const validateTimelineEntry = require("../middleware/validateTimelineEntry");
const asyncHandler = require("../middleware/asyncHandler");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.use(authenticateToken);

router.get("/", asyncHandler(timelineController.getAllEntries));
router.post("/", validateTimelineEntry, asyncHandler(timelineController.createEntry));
router.get("/:id", validateId, asyncHandler(timelineController.getEntryById));
router.put("/:id", validateId, validateTimelineEntry, asyncHandler(timelineController.updateEntry));
router.delete("/:id", validateId, asyncHandler(timelineController.deleteEntry));

module.exports = router;