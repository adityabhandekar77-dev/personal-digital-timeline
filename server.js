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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});