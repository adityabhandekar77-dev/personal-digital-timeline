const validateId = (req, res, next) =>{
    const { id } = req.params;

    if(isNaN(id)){
        return res.status(400).json({
            error: "ID must be a valid number"
        });

    }

    next();



};

module.exports = validateId;