const mysql = require("../mysql");
const getId = async (req, res, next) => {
    const id = req.params.id;
    try {
        const query = `SELECT * FROM files WHERE id = ?`;
        const result = await mysql.execute(query, [id]);
        const files = result.map((file) => {
            return {
                id: file.id,
                name: file.filename,
                description: file.description,
                created_at: file.created_at,
                updated_at: file.updated_at,
            };
        }
        );
        return res.status(200).send({
            files: files,
        });
    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }

}
module.exports = getId;