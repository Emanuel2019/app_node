const express= require('express');
const route= express.Router();
const mysql = require("../mysql").pool;
// Lista todos os utilizadores
route.get('/',(req, res, next) => {
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
);
// Regista um novo utilizador
route.post('/',(req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query("INSERT INTO users (name,email,password,role,country,phone) VALUES (?,?,?,?,?,?)",
            [req.body.name, req.body.email, req.body.password, req.body.role, req.body.country, req.body.phone],
            (error, resultado, field) => {
                if (error) {
                    res.status(500).send({
                        error: error,
                    });
                } else {
                    res.status(201).send({
                        message: "Utilizador registado com sucesso!",
                        Id: resultado.insertId,
                    });
                }
                conn.release();
            }
        );
    }
    );
}
);
// Lista um utilizador especifico
route.get('/:id',(req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(`SELECT * FROM users WHERE id=${id}`, (error, result, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error,
                });
            }
            const user = result.map((user) => {
                return {
                    id: user.id,
                    name: user.name,
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
        }
        );
        //   res.status(200).send({ message: "Listei todos os users do sistema!" });
    }

);
}
);
// Atualiza um utilizador especifico
route.put('/:id',(req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        conn.query(
            "UPDATE users SET name=?,email=?,password=?,active=?,group_id=? WHERE id=?",
            [req.body.name, req.body.email, req.body.password, req.body.active, req.body.group_id, id],
            (error, resultado, field) => {
                if (error) {
                    res.status(500).send({
                        error: error,
                    });
                } else {
                    res.status(201).send({
                        message: "Utilizador actualizado com sucesso!",
                        Id: resultado.insertId,
                    });
                }
                conn.release();
            }
        );
    }
    );
}

);

// Apaga um utilizador especifico
route.delete('/:id',(req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        conn.query(`DELETE FROM users WHERE id=${id}`, (error, result, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error,
                });
            }
            const user = result.map((user) => {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    active: user.active,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                };
            }
            );
            return res.status(200).send({
                user: user,
            });
        }
        );
        //   res.status(200).send({ message: "Listei todos os users do sistema!" });
    }
    );
}

);
route.post('/login', function(req, res) {
    let username=req.body.email;
   let password=req.body.password;
    if(password===null){
        console.log('Please enter a password');
        return res.status(403).send(
            {
                message: 'Username or password is required.',

            }
        );
    }
}
);
module.exports = route;
