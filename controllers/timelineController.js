const pool = require("../db");

const getAllEntries = async (req, res)=> {

     try {
        const result = await pool.query(
            "SELECT * FROM timeline_entries ORDER BY created_at DESC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database query failed"
        });
    }
};

const createEntry = async(req, res)=>{

      try {
        const { title, description, type } = req.body;

        
        if (!title || !description || !type) {
            return res.status(400).json({
                error: "title, description, and type are required"
            });
        }

        
        const result = await pool.query(
            `INSERT INTO timeline_entries (title, description, type, created_at)
             VALUES ($1, $2, $3, NOW())
             RETURNING *`,
            [title, description, type]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }

};

const getEntryById = async(req, res) =>{

     try {
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

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Database query failed"
        });
    }

};

const updateEntry = async (req, res) =>{

     try{

    
    const { id } = req.params;
    const { title, description, type } = req.body;



if (!title || !description || !type) {
            return res.status(400).json({
                error: "title, description, and type are required"
            });
        }

        const result = await pool.query(
    "UPDATE timeline_entries SET title = $1, description = $2, type = $3 WHERE id = $4 RETURNING *",
    [title, description, type, id]
);
if(result.rows.length === 0){

    return res.status(404).json({
                error: "Timeline entry not found"
            });

}

res.status(200).json(result.rows[0]);
} catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database query failed"
        });
    }

};

const deleteEntry = async ( req, res) =>{

       try{

        const { id } = req.params;
        

        

        

            const result = await pool.query(
               "DELETE FROM timeline_entries WHERE id = $1 RETURNING *",
                [id]

            );

            if(result.rows.length === 0){

    return res.status(404).json({
                error: "Timeline entry not found"
            });


        }

        res.status(200).json(result.rows[0]);
} catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database query failed"
        });
    }

};

module.exports = {
    getAllEntries,
    createEntry,
    getEntryById,
    updateEntry,
    deleteEntry
};



