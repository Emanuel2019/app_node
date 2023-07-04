const express = require('express');
const route = express.Router();
const mysql = require("../mysql").pool;
// Lista todos os tipoes
route.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(`SELECT replies.id, replies.user_id, users.name AS user_name, replies.task_id, tasks.name AS task_name, replies.message, replies.created_at, replies.updated_at
        FROM replies
        JOIN users ON replies.user_id = users.id
        JOIN tasks ON replies.task_id = tasks.id;
        `, (error, result, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error,
                });
            }
            const replies = result.map((replay) => {
                return {
                    id: replay.id,
                    user: {
                         id: replay.user_id,
                         name:replay.user_name

                         },
                  tasks: { 
                    id: replay.task_id,
                    name:replay.task_name
                },
                    message: replay.message,
                    created_at: replay.created_at,
                    updated_at: replay.updated_at,
                };
            });
            return res.status(200).send({
                replies: replies,
            });
        }
        );
        //   res.status(200).send({ message: "Listei todos os users do sistema!" });
    }
    );
}
);
// Regista um novo tipo
route.post('/', (req, res, next) => {
    const currentDate = new Date();
    const active = 1;
    mysql.getConnection((error, conn) => {
        if (error) {
            res.status(500).send({
                error: error,
            });
            return;
        }

        conn.query(
            "INSERT INTO replies (user_id, task_id, message, created_at,updated_at) VALUES (?, ?, ?, ?,?)",
            [
                req.body.user_id,
                req.body.task_id,
                req.body.message,
                currentDate,
                currentDate,
            ],
            (error, resultado, field) => {
                if (error) {
                    res.status(500).send({
                        error: error,
                    });
                } else {
                    res.status(201).send({
                        message: " Resposta registado com sucesso!",
                        Id: resultado.insertId,
                    });
                }
                conn.release();
            }
        );
    });
});

// Lista um tipo especifico
route.get('/:id', (req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(`SELECT replies.id, replies.user_id, users.name AS user_name, replies.task_id, tasks.name AS task_name, replies.message, replies.created_at, replies.updated_at
        FROM replies
        JOIN users ON replies.user_id = users.id
        JOIN tasks ON replies.task_id = tasks.id WHERE replies.id=?`, [id], (error, result, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error,
                });
            }
            const replies = result.map((replay) => {
                return {
                    id: replay.id,
                    user: {
                         id: replay.user_id,
                         name:replay.user_name

                         },
                  tasks: { 
                    id: replay.task_id,
                    name:replay.task_name
                },
                    message: replay.message,
                    created_at: replay.created_at,
                    updated_at: replay.updated_at,
                };
            }
            );
            return res.status(200).send({
                replies: replies,
            });
        }
        );
        //   res.status(200).send({ message: "Listei todos os users do sistema!" });
    }
    );
}
);
// Atualiza um tipo especifico
route.put('/:id', (req, res, next) => {
    const id = req.params.id;

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }

        conn.query(
            "UPDATE replies SET user_id = ?, task_id = ?, message = ? WHERE id = ?",
            [req.body.user_id, req.body.task_id, req.body.message, id],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                    });
                }

                return res.status(200).send({
                    message: "Resposta editado com sucesso!",
                    id: id,
                });
            }
        );
    });
});

// Apaga um tipo especifico
route.delete('/:id', (req, res, next) => {
    const id = req.params.id;

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }

        conn.query(
            "DELETE FROM replies WHERE id = ?",
            [id],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                    });
                }

                return res.status(200).send({
                    message: " Registo excluído com sucesso!",
                    id: id,
                });
            }
        );
    });
});

module.exports = route;
