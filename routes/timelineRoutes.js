const express = require("express");

const timelineController = require("../controllers/timelineController");
const validateId = require("../middleware/validateId");
const validateTimelineEntry = require("../middleware/validateTimelineEntry");

const router = express.Router();

router.get("/", timelineController.getAllEntries);
router.post("/", validateTimelineEntry, timelineController.createEntry);
router.get("/:id",validateId, timelineController.getEntryById);
router.put("/:id", validateId,validateTimelineEntry ,timelineController.updateEntry);
router.delete("/:id",validateId, timelineController.deleteEntry);

module.exports = router;

