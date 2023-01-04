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
route.post('/',(req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            "INSERT INTO files (name,description,active) VALUES (?,?,?)",
            [req.body.name, req.body.description, req.body.active],
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
    }
    );
}
);
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
            "UPDATE files SET name = ?, description = ?, active = ? WHERE id = ?",
            [req.body.name, req.body.description, req.body.active, id],
            (error, result, field) => {
                if (error) {
                    res.status(500).send({
                        error: error,
                    });
                } else {
                    res.status(201).send({
                        message: "Ficheiro atualizado com sucesso!",
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
