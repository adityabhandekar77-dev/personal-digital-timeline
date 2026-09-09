const express = require("express");

const app = express();

const PORT = 3000;

app.get("/", (req, res) =>{
    res.send("Personal Digital Timeline API is running! ");
});

app.get("/api/timeline", (req, res) => {
    res.json([
        {
            id: 1,
            title: "Started Personal Digital Timeline",
            type: "project",
            date: "2026-09-09"
        }
    ]);
});

app.listen(PORT, () => {
    console.log('Server running on http://localhost:${PORT}');
});
