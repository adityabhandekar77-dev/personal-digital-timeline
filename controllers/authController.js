const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const register = async (req, res) => {
    const { email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
        [email, passwordHash]
    );

    res.status(201).json(result.rows[0]);
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const result = await pool.query(
        "SELECT id, email, password_hash FROM users WHERE email = $1",
        [email]
    );

    if (result.rows.length === 0) {
        return res.status(401).json({
            error: "Invalid email or password"
        });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatch) {
        return res.status(401).json({
            error: "Invalid email or password"
        });
    }

    const token = jwt.sign(
    {
        userId: user.id,
        email: user.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);

res.json({
    message: "Login successful",
    token
});
};

module.exports = {
    register,
    login
};