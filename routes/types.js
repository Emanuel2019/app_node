const express= require('express');
const route= express.Router();
const mysql = require("../mysql").pool;
// Lista todos os tipoes
route.get('/',(req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(`SELECT * FROM types`, (error, result, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error,
                });
            }
            const types = result.map((type) => {
                return {
                    id: type.id,
                    name: type.name,
                    description: type.description,
                    created_at: type.created_at,
                    updated_at: type.updated_at,
                };
            });
            return res.status(200).send({
                types: types,
            });
        }
        );
        //   res.status(200).send({ message: "Listei todos os users do sistema!" });
    }
    );
}
);
// Regista um novo tipo
route.post('/',(req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            "INSERT INTO types (name,description,active) VALUES (?,?,?)",
            [req.body.name, req.body.description, req.body.active],
            (error, resultado, field) => {
                if (error) {
                    res.status(500).send({
                        error: error,
                    });
                } else {
                    res.status(201).send({
                        message: "tipo registado com sucesso!",
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
// Lista um tipo especifico
route.get('/:id',(req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(`SELECT * FROM types WHERE id=?`, [id], (error, result, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error,
                });
            }
            const types = result.map((type) => {
                return {
                    id: type.id,
                    name: type.name,
                    description: type.description,
                    created_at: type.created_at,
                    updated_at: type.updated_at,
                };
            }
            );
            return res.status(200).send({
                types: types,
            });
        }
        );
        //   res.status(200).send({ message: "Listei todos os users do sistema!" });
    }
    );
}
);
// Atualiza um tipo especifico
route.put('/:id',(req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        conn.query(
            "UPDATE types SET name = ?, description = ?, active = ? WHERE id = ?",
            [req.body.name, req.body.description, req.body.active, id],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                    });
                }
                const types = result.map((type) => {
                    return {
                        id: type.id,
                        name: type.name,
                        description: type.description,
                        created_at: type.created_at,
                        updated_at: type.updated_at,
                    };
                }
                );
                return res.status(200).send({
                    types: types,
                });
            }
        );
    }
    );
}
);
// Apaga um tipo especifico
route.delete('/:id',(req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        conn.query(
            "DELETE FROM types WHERE id = ?",
            [id],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                    });
                }
                const types = result.map((type) => {
                    return {
                        id: type.id,
                        name: type.name,
                        description: type.description,
                        created_at: type.created_at,
                        updated_at: type.updated_at,
                    };
                }
                );
                return res.status(200).send({
                    types: types,
                });
            }
        );
    }
    );
}
);
module.exports = route;
