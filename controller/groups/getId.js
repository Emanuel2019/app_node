const mysql = require("../mysql");
const getId = async (req, res, next) => {
    const id = req.params.id;
    try {
        const query = `SELECT * FROM \`groups\` WHERE id = ?`;
        const result = await mysql.execute(query, [id]);
        const groups = result.map((groups) => {
            return {
                id: groups.id,
                name: groups.name,
                description: groups.description,
                user_id:groups.user_id,
                created_at: groups.created_at,
                updated_at: groups.updated_at,
            };
        }
        );
        return res.status(200).send({
            groups: groups,
        });
    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }

}
module.exports = getId;