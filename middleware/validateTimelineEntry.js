const validateTimelineEntry = (req, res, next) => {
    const { title, description, type } = req.body;

    const allowedTypes = [
        "project",
        "learning",
        "milestone",
        "achievement",
        "goal"
    ];

    if (!title || !description || !type) {
        return res.status(400).json({
            error: "title, description, and type are required"
        });
    }

    if (typeof title !== "string" || typeof description !== "string" || typeof type !== "string") {
        return res.status(400).json({
            error: "title, description, and type must be strings"
        });
    }

    if (title.length > 255) {
    return res.status(400).json({
        error: "title cannot exceed 255 characters"
    });
}

if (description.length > 5000) {
    return res.status(400).json({
        error: "description cannot exceed 5000 characters"
    });
}

    if (!title.trim() || !description.trim()) {
        return res.status(400).json({
            error: "title and description cannot be empty"
        });
    }

    if (!allowedTypes.includes(type)) {
        return res.status(400).json({
            error: "Invalid timeline type"
        });
    }

    next();
};

module.exports = validateTimelineEntry;
