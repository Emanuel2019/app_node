const express= require('express');
const mysql = require("../mysql").pool;
const deleteUser =(req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        conn.query(`DELETE FROM users WHERE id=${id}`, (error, result, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error,
                });
            }
          
            return res.status(200).send({
                message: "Utilizador excluido com sucesso!",
                id:id,
            });
        }
        );
       
    }
    );
}
module.exports=deleteUser;