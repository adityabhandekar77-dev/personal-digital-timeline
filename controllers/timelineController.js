const pool = require("../db");

const getAllEntries = async (req, res) => {
    const { userId } = req.user;
    const { page, limit, type, sort } = req.pagination;

    const offset = (page - 1) * limit;

    const sortOrder = sort === "oldest" ? "ASC" : "DESC";

    let query = `
        SELECT *,
               COUNT(*) OVER() AS total_count
        FROM timeline_entries
        WHERE user_id = $1
    `;

    const params = [userId];

    if (type) {
        query += ` AND type = $2`;
        params.push(type);
    }

    query += `
        ORDER BY created_at ${sortOrder}, id ${sortOrder}
        LIMIT $${params.length + 1}
        OFFSET $${params.length + 2}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);

    const total = result.rows.length > 0
        ? Number(result.rows[0].total_count)
        : 0;

    const totalPages = Math.ceil(total / limit);

    const data = result.rows.map(({ total_count, ...entry }) => entry);

    res.json({
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    });
};

const createEntry = async (req, res) => {
    const { title, description, type } = req.body;
    const { userId } = req.user;

    const result = await pool.query(
        `INSERT INTO timeline_entries (title, description, type, created_at, user_id)
         VALUES ($1, $2, $3, NOW(), $4)
         RETURNING *`,
        [title, description, type, userId]
    );

    res.status(201).json(result.rows[0]);
};

const getEntryById = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    const result = await pool.query(
        "SELECT * FROM timeline_entries WHERE id = $1 AND user_id = $2",
        [id, userId]
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
    const { userId } = req.user;

    const result = await pool.query(
        `UPDATE timeline_entries
         SET title = $1, description = $2, type = $3
         WHERE id = $4 AND user_id = $5
         RETURNING *`,
        [title, description, type, id, userId]
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
    const { userId } = req.user;

    const result = await pool.query(
        "DELETE FROM timeline_entries WHERE id = $1 AND user_id = $2 RETURNING *",
        [id, userId]
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