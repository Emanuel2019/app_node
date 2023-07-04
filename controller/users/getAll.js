const mysql = require("../mysql");
const getAll = async (req, res, next) => {

    try {
        const result = await mysql.execute("SELECT * FROM users");
        {
            const users = result.map((user) => {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    active: user.active,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                };
            });
            return res.status(200).send({
                users: users,
            });



        }
    } catch (error) {
        res.status(500).send({
            error: error,
        });
    }
}
module.exports = getAll;