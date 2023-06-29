const express= require('express');
const route= express.Router();
const mysql = require("../mysql").pool;
const { v4: uuidv4 } = require('uuid');
// Lista todos os clientees
route.get('/',(req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(`SELECT * FROM clients`, (error, result, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error,
                });
            }
            const clientss = result.map((clients) => {
                return {
                    id: clients.id,
                    reference : clients.reference,
                    name: clients.name,
                    address: clients.address,
                    country: clients.country,
                    city: clients.city,
                    phone1: clients.phone1,
                    phone2: clients.phone2,
                    email1: clients.email1,
                    email2: clients.email2,
                    Active: clients.Active,
                    user_id: clients.user_id,
                    created_at: clients.created_at,
                    updated_at: clients.updated_at,
                };
            });
            return res.status(200).send({
                clientss: clientss,
            });
        });
        //   res.status(200).send({ message: "Listei todos os clientss do sistema!" });
    });
}
);
// Regista um novo cliente
route.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            res.status(500).send({
                error: error,
            });
            return;
        }

        const reference = 'HT' + uuidv4().replace(/-/g, '');

        conn.query(
            "INSERT INTO clients (reference, name, address, country, city, phone1, phone2, email1, email2, Active, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                reference,
                req.body.name,
                req.body.address,
                req.body.country,
                req.body.city,
                req.body.phone1,
                req.body.phone2,
                req.body.email1,
                req.body.email2,
                req.body.Active,
                req.body.user_id,
            ],
            (error, resultado, field) => {
                if (error) {
                    res.status(500).send({
                        error: error,
                    });
                } else {
                    res.status(201).send({
                        message: "Cliente registado com sucesso!",
                        Id: resultado.insertId,
                    });
                }
                conn.release();
            }
        );
    });
});
// Lista um cliente especifico
route.get('/:id',(req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(`SELECT * FROM clients WHERE id=${id}`, (error, result, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error,
                });
            }
            const clients = result.map((clients) => {
                return {
                    id: clients.id,
                    reference : clients.reference,
                    name: clients.name,
                    address: clients.address,
                    country: clients.country,
                    city: clients.city,
                    phone1: clients.phone1,
                    phone2: clients.phone2,
                    email1: clients.email1,
                    email2: clients.email2,
                    Active: clients.Active,
                    user_id: clients.user_id,
                    created_at: clients.created_at,
                    updated_at: clients.updated_at,
                };
            });
            return res.status(200).send({
                clients: clients,
            });
        }
        );
        //   res.status(200).send({ message: "Listei todos os clientss do sistema!" });
    }
    );
}
);
// Atualiza um cliente especifico
route.put('/:id',(req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(
            "UPDATE clients SET reference=?,name=?,address=?,country=?,city=?,phone1=?,phone2=?,email1=?,email2=?,Active=?,user_id=? WHERE id=?",
            [req.body.reference, req.body.name, req.body.address, req.body.country, req.body.city, req.body.phone1, req.body.phone2, req.body.email1, req.body.email2, req.body.Active, req.body.user_id, id],
            (error, resultado, field) => {
                if (error) {
                    res.status(500).send({
                        error: error,
                    });
                } else {
                    res.status(201).send({
                        message: "Cliente atualizado com sucesso!",
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
// Apaga um cliente especifico
route.delete('/:id',(req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(`DELETE FROM clients WHERE id=${id}`, (error, result, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error,
                });
            }
            res.status(201).send({
                message: "Cliente apagado com sucesso!",
            });
        }
        );
    }
    );
}
);
module.exports = route;
