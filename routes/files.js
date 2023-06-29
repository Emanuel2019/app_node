const express= require('express');
const route= express.Router();
const mysql = require("../mysql").pool;
// Lista todos os Ficheiroes
route.get('/',(req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(`SELECT * FROM files`, (error, result, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error,
                });
            }
            const files = result.map((file) => {
                return {
                    id: file.id,
                    name: file.name,
                    description: file.description,
                    created_at: file.created_at,
                    updated_at: file.updated_at,
                };
            });
            return res.status(200).send({
                files: files,
            });
        }
        );
        //   res.status(200).send({ message: "Listei todos os users do sistema!" });
    }
    );
}
);
// Regista um novo Ficheiro
route.post('/', (req, res, next) => {
    const currentDate = new Date();

    mysql.getConnection((error, conn) => {
        if (error) {
            res.status(500).send({
                error: error,
            });
            return;
        }

        conn.query(
            "INSERT INTO files (filename, task_id, reply_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
            [
                req.body.filename,
                req.body.task_id,
                req.body.reply_id,
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
                        message: "Ficheiro registado com sucesso!",
                        Id: resultado.insertId,
                    });
                }
                conn.release();
            }
        );
    });
});

// Lista um Ficheiro especifico
route.get('/:id',(req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(`SELECT * FROM files WHERE id = ?`, [id], (error, result, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error,
                });
            }
            const files = result.map((file) => {
                return {
                    id: file.id,
                    name: file.name,
                    description: file.description,
                    created_at: file.created_at,
                    updated_at: file.updated_at,
                };
            }
            );
            return res.status(200).send({
                files: files,
            });
        }
        );
        //   res.status(200).send({ message: "Listei todos os users do sistema!" });
    }
);
}
);
// Atualiza um Ficheiro especifico
route.put('/:id',(req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        conn.query(
            "UPDATE files SET filename = ?, task_id = ?, reply_id = ? WHERE id = ?",
            [req.body.filename, req.body.task_id, req.body.reply_id, id],
            (error, result, field) => {
                if (error) {
                    res.status(500).send({
                        error: error,
                    });
                } else {
                    res.status(201).send({
                        message: "Ficheiro atualizado com sucesso!",
                        Id: result.id,
                    });
                }
                conn.release();
            }
        );
    }
    );
}
);
// Apaga um Ficheiro especifico
route.delete('/:id',(req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        conn.query(
            "DELETE FROM files WHERE id = ?",
            [id],
            (error, result, field) => {
                if (error) {
                    res.status(500).send({
                        error: error,
                    });
                } else {
                    res.status(201).send({
                        message: "Ficheiro apagado com sucesso!",
                        Id: result.insertId,
                    });
                }
                conn.release();
            }
        );
    }
    );
}
);
module.exports = route;
