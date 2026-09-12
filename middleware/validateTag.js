const validateTag = (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            error: "name is required"
        });
    }

    if (typeof name !== "string") {
        return res.status(400).json({
            error: "name must be a string"
        });
    }

    if (!name.trim()) {
        return res.status(400).json({
            error: "name cannot be empty"
        });
    }

    if (name.length > 50) {
        return res.status(400).json({
            error: "name cannot exceed 50 characters"
        });
    }

    next();
};

module.exports = validateTag;