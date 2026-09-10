const express = require("express");
const authController = require("../controllers/authController");
const asyncHandler = require("../middleware/asyncHandler");
const validateAuth = require("../middleware/validateAuth");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.post("/register", validateAuth, asyncHandler(authController.register));
router.post("/login", validateAuth, asyncHandler(authController.login));

router.get("/me", authenticateToken, (req, res) => {
    res.json({
        message: "Authenticated successfully",
        user: req.user
    });
});

module.exports = router;