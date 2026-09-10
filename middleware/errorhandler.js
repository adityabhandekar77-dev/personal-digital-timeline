const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.code === "23505") {
        return res.status(409).json({
            error: "Email already registered"
        });
    }

    res.status(500).json({
        error: "Internal server error"
    });
};

module.exports = errorHandler;
