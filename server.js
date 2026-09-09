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

app.post('/api/timeline', async (req, res) => {
  try {
    const { title, description, type } = req.body;

    
    if (!title || !description || !type) {
      return res.status(400).json({ 
        error: 'title, description, and type are required' 
      });
    }

    
    const result = await pool.query(
      `INSERT INTO timeline_entries (title, description, type)
     VALUES ($1, $2, $3)
     RETURNING *`,
      [title, description, type]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});