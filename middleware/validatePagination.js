const validatePagination = (req, res, next) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const type = req.query.type;
    const sort = req.query.sort || "newest";

    const allowedTypes = [
        "project",
        "learning",
        "milestone",
        "achievement",
        "goal"
    ];

    const allowedSorts = [
        "newest",
        "oldest"
    ];

    if (!Number.isInteger(page) || page < 1) {
        return res.status(400).json({
            error: "page must be a positive integer"
        });
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
        return res.status(400).json({
            error: "limit must be an integer between 1 and 50"
        });
    }

    if (type && !allowedTypes.includes(type)) {
        return res.status(400).json({
            error: "Invalid timeline type"
        });
    }

    if (!allowedSorts.includes(sort)) {
        return res.status(400).json({
            error: "sort must be either newest or oldest"
        });
    }

    req.pagination = {
        page,
        limit,
        type,
        sort
    };

    next();
};

module.exports = validatePagination;