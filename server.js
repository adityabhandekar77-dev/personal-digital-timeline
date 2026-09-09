const express = require("express");
const pool = require("./db");


const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Personal Digital Timeline API");
});

app.get("/api/timeline", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM timeline_entries ORDER BY created_at DESC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database query failed"
        });
    }
});


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
