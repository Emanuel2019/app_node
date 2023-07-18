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
                    username:user.name

                   
                };
            });
            return res.status(200).send({
                 users:users
            });



        }
    } catch (error) {
        res.status(500).send({
            error: error,
        });
    }
}
module.exports = getAll;