const mysql = require("../mysql");
const getId = async (req, res, next) => {
    const id = req.params.id;
    try {
        const query =  `SELECT * FROM status WHERE id = ?`;
        const result = await mysql.execute(query, [id]);
        const status = result.map((status) => {
            return {
                id:status.id,
                name: status.name,
                description: status.description,
                color:status.color,
                created_at: status.created_at,
                updated_at: status.updated_at,
            };
        }
        );
        return res.status(200).send({
            status: status,
        });
    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }

}
module.exports = getId;