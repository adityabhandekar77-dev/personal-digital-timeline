const pool = require("../db");

const getAllEntries = async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM timeline_entries ORDER BY created_at DESC"
    );

    res.json(result.rows);
};

const createEntry = async (req, res) => {
    const { title, description, type } = req.body;

    const result = await pool.query(
        `INSERT INTO timeline_entries (title, description, type, created_at)
         VALUES ($1, $2, $3, NOW())
         RETURNING *`,
        [title, description, type]
    );

    res.status(201).json(result.rows[0]);
};

const getEntryById = async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "SELECT * FROM timeline_entries WHERE id = $1",
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            error: "Timeline entry not found"
        });
    }

    res.json(result.rows[0]);
};

const updateEntry = async (req, res) => {
    const { id } = req.params;
    const { title, description, type } = req.body;

    const result = await pool.query(
        `UPDATE timeline_entries
         SET title = $1, description = $2, type = $3
         WHERE id = $4
         RETURNING *`,
        [title, description, type, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            error: "Timeline entry not found"
        });
    }

    res.status(200).json(result.rows[0]);
};

const deleteEntry = async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "DELETE FROM timeline_entries WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            error: "Timeline entry not found"
        });
    }

    res.status(200).json(result.rows[0]);
};

module.exports = {
    getAllEntries,
    createEntry,
    getEntryById,
    updateEntry,
    deleteEntry
};