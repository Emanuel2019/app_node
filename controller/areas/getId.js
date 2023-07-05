
const mysql = require("../mysql");
const getId = async (req, res, next) => {
    const id = req.params.id;
    try {
        const result = await mysql.execute("SELECT * FROM areas where id=?",[id]);
        const areas = result.map((area) => {
            return {
                id: area.id,
                name: area.name,
                description: area.description,
                created_at: area.created_at,
                updated_at: area.updated_at,
            };
        });
        return res.status(200).send({
            areas: areas,
        });
    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
    
}
module.exports = getId;