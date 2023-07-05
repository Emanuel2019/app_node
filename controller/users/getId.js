const mysql = require("../mysql");
const getId = async (req, res, next) => {
    const id = req.params.id;
    try {
        const query = `SELECT * FROM users WHERE id=${id}`;
        const result = await mysql.execute(query);
        const user = result.map((user) => {
            return {
                id: user.id,
                name: user.name,
                role:user.role,
                email: user.email,
                active: user.active,
                created_at: user.created_at,
                updated_at: user.updated_at,
            };
        }
        );
        return res.status(200).send({
            user: user,
        });
    } catch (error) {
        res.status(500).send({
            error: error,
        });
    }

}
module.exports = getId;