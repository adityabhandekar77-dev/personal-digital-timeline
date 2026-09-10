const express = require("express");
const timelineRoutes = require("./routes/timelineRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.use("/api/timeline", timelineRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Personal Digital Timeline API");
});

app.use(errorHandler);

module.exports = app;