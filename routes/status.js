const express = require("express");
const route = express.Router();
const mysql = require("../mysql").pool;
// Lista todos os estadoes
route.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(`SELECT * FROM status`, (error, result, field) => {
      conn.release();
      if (error) {
        return res.status(500).send({
          error: error,
        });
      }
      const status = result.map((status) => {
        return {
          id: status.id,
          name: status.name,
          description: status.description,
          created_at: status.created_at,
          updated_at: status.updated_at,
        };
      });
      return res.status(200).send({
        status: status,
      });
    });
    //   res.status(200).send({ message: "Listei todos os users do sistema!" });
  });
});
// Regista um novo estado
route.post("/", (req, res, next) => {
  const currentDate=new Date();
  mysql.getConnection((error, conn) => {
    conn.query(
      "INSERT INTO status (name,description,color,created_at,updated_at) VALUES (?,?,?,?,?)",
      [req.body.name, req.body.description, req.body.color,currentDate,currentDate],
      (error, resultado, field) => {
        if (error) {
          res.status(500).send({
            error: error,
          });
        } else {
          res.status(201).send({
            message: "status registado com sucesso!",
            Id: resultado.insertId,
          });
        }
        conn.release();
      }
    );
  });
});
// Lista um estado especifico
route.get("/:id", (req, res, next) => {
  const id = req.params.id;
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(
      `SELECT * FROM status WHERE id = ?`,
      [id],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        const status = result.map((status) => {
          return {
            id: status.id,
            name: status.name,
            description: status.description,
            created_at: status.created_at,
            updated_at: status.updated_at,
          };
        });
        return res.status(200).send({
          status: status,
        });
      }
    );
    //   res.status(200).send({ message: "Listei todos os users do sistema!" });
  });
});
// Atualiza um estado especifico
route.put("/:id", (req, res, next) => {
  const id = req.params.id;
  const currentDate=new Date();
  mysql.getConnection((error, conn) => {
    conn.query(
      "UPDATE status SET name = ?, description = ?, color = ?,updated_at=? WHERE id = ?",
      [req.body.name, req.body.description, req.body.color,currentDate, id],
      (error, result, field) => {
        if (error) {
          res.status(500).send({
            error: error,
          });
        } else {
          res.status(202).send({
            message: "status atualizado com sucesso!",
            Id: result.insertId,
          });
        }
        conn.release();
      }
    );
  });
});
// Apaga um estado especifico
route.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  mysql.getConnection((error, conn) => {
    conn.query(
      "DELETE FROM status WHERE id = ?",
      [id],
      (error, result, field) => {
        if (error) {
          res.status(500).send({
            error: error,
          });
        } else {
          res.status(202).send({
            message: "status apagado com sucesso!",
            Id: result.insertId,
          });
        }
        conn.release();
      }
    );
  });
});
module.exports = route;
