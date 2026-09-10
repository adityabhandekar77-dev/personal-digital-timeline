const validateTimelineEntry = (req, res, next) =>{
    const { title, description, type } = req.body;

    if(!title || !description || !type) {
        return res.status(400).json({
            error: "title, description, and type are required"
        });
    }
    next();

};

module.exports = validateTimelineEntry;


