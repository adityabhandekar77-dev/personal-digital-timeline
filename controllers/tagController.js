const pool = require("../db");
const { withTransaction } = require("../db");

const createTag = async (req, res) => {
    const { name } = req.body;

    const result = await pool.query(
        "INSERT INTO tags (name) VALUES ($1) RETURNING *",
        [name]
    );

    res.status(201).json(result.rows[0]);
};

const getAllTags = async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM tags ORDER BY name ASC"
    );

    res.json(result.rows);
};

const addTagToEntry = async (req, res) => {
    const { id } = req.params;
    const { tagId } = req.body;
    const { userId } = req.user;

    const entryResult = await pool.query(
        "SELECT id FROM timeline_entries WHERE id = $1 AND user_id = $2",
        [id, userId]
    );

    if (entryResult.rows.length === 0) {
        return res.status(404).json({
            error: "Timeline entry not found"
        });
    }

    const tagResult = await pool.query(
        "SELECT id FROM tags WHERE id = $1",
        [tagId]
    );

    if (tagResult.rows.length === 0) {
        return res.status(404).json({
            error: "Tag not found"
        });
    }

    const result = await pool.query(
        `INSERT INTO entry_tags (entry_id, tag_id)
         VALUES ($1, $2)
         ON CONFLICT (entry_id, tag_id) DO NOTHING
         RETURNING *`,
        [id, tagId]
    );

    if (result.rows.length === 0) {
        return res.status(409).json({
            error: "Tag is already assigned to this entry"
        });
    }

    res.status(201).json(result.rows[0]);
};
const removeTagFromEntry = async (req, res) => {
    const { id, tagId } = req.params;
    const { userId } = req.user;

    const entryResult = await pool.query(
        "SELECT id FROM timeline_entries WHERE id = $1 AND user_id = $2",
        [id, userId]
    );

    if (entryResult.rows.length === 0) {
        return res.status(404).json({
            error: "Timeline entry not found"
        });
    }

    const result = await pool.query(
        "DELETE FROM entry_tags WHERE entry_id = $1 AND tag_id = $2 RETURNING *",
        [id, tagId]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            error: "Tag is not assigned to this entry"
        });
    }

    res.json(result.rows[0]);
};


module.exports = {
    createTag,
    getAllTags,
    addTagToEntry,
    removeTagFromEntry,
    
};