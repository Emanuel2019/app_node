const  mysql = require('mysql');
const getall=(req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });

        }
        conn.query(`SELECT * FROM users`, (error, result, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error,
                });
            }
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
        );
        //   res.status(200).send({ message: "Listei todos os users do sistema!" });
    }
    );
}
module.exports =getall;