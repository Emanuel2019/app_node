const express= require('express');
const route= express.Router();
const mysql = require("../mysql").pool;
// Lista todos os Canales
route.get('/',(req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(`SELECT * FROM channels`, (error, result, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error,
                });
            }
            const channels = result.map((channel) => {
                return {
                    id: channel.id,
                    name: channel.name,
                    description: channel.description,
                    created_at: channel.created_at,
                    updated_at: channel.updated_at,
                };
            });
            return res.status(200).send({
                channels: channels,
            });
        }
        );
        //   res.status(200).send({ message: "Listei todos os users do sistema!" });
    }
    );
}
);
// Regista um novo Canal
route.post('/',(req, res, next) => {
    const curretDate= new Date();
    mysql.getConnection((error, conn) => {
        conn.query(
            "INSERT INTO channels (name,description,created_at,updated_at) VALUES (?,?,?,?)",
            [req.body.name, req.body.description, curretDate, curretDate],
            (error, resultado, field) => {
                if (error) {
                    res.status(500).send({
                        error: error,
                    });
                } else {
                    res.status(201).send({
                        message: "Canal registado com sucesso!",
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
// Lista um Canal especifico
route.get('/:id',(req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        conn.query(`SELECT * FROM channels WHERE id = ?`, [id], (error, result, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error,
                });
            }
            const channels = result.map((channel) => {
                return {
                    id: channel.id,
                    name: channel.name,
                    description: channel.description,
                    created_at: channel.created_at,
                    updated_at: channel.updated_at,
                };
            });
            return res.status(200).send({
                channels: channels,
            });
        }
        );
        //   res.status(200).send({ message: "Listei todos os users do sistema!" });
    }
);
}
);
// Atualiza um Canal especifico
route.put('/:id',(req, res, next) => {
    const id = req.params.id;
    const currentDate=new Date();
    mysql.getConnection((error, conn) => {
        conn.query(
            "UPDATE channels SET name=?,description=?,updated_at=? WHERE id=?",
            [req.body.name, req.body.description, currentDate, id],
            (error, resultado, field) => {
                if (error) {
                    res.status(500).send({
                        error: error,
                    });
                } else {
                    res.status(201).send({
                        message: "Canal atualizado com sucesso!",
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
// Apaga um Canal especifico
route.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        
        conn.query(
            "DELETE FROM channels WHERE id = ?",
            [id],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                    });
                }
                
                return res.status(200).send({
                    message: "Canal excluído com sucesso!",
                    id: id,
                });
            }
        );
    });
});

module.exports = route;
