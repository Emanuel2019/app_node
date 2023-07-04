const express = require("express");
const route = express.Router();
const mysql = require("../mysql").pool;
// Lista todos os groupses
route.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
      if (error) {
          return res.status(500).send({
              error: error,
          });
      }

      conn.query(`SELECT * FROM priority`, (error, result, field) => {
          conn.release();
          if (error) {
              return res.status(500).send({
                  error: error,
              });
          }

          const priorities = result.map((priority) => {
              return {
                  id: priority.id,
                  name: priority.name,
                  duration: priority.duration,
                  responseTime:priority.responseTime,
                  active:priority.active,
                  created_at: priority.created_at,
                  updated_at: priority.updated_at,
              };
          });

          return res.status(200).send({
            priorities: priorities,
          });
      });
  });
});


// Regista um novo groups
route.post("/", (req, res, next) => {
  const currentDate=new Date();
  const active=1;
  mysql.getConnection((error, conn) => {
    conn.query(
      "INSERT INTO priority (name,duration,responseTime,active,created_at,updated_at) VALUES (?,?,?,?,?,?)",
      [req.body.name, req.body.duration, req.body.responseTime,active, currentDate,currentDate ],
      (error, resultado, field) => {
        if (error) {
          res.status(500).send({
            error: error,
          });
        } else {
          res.status(201).send({
            message: "prioridade registado com sucesso!",
            Id: resultado.insertId,
          });
        }
        conn.release();
      }
    );
  });
});
// Lista um groups especifico
route.get("/:id", (req, res, next) => {
  const id = req.params.id;
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(
      `SELECT * FROM priority WHERE id = ?`,
      [id],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        const priorities = result.map((priorities) => {
          return {
            id: priorities.id,
            name: priorities.name,
            duration: priorities.duration,
            responseTime:priorities.responseTime,
            active:priorities.active,
            created_at: priorities.created_at,
            updated_at: priorities.updated_at,
          };
        });
        return res.status(200).send({
            priorities: priorities,
        });
      }
    );
    //   res.status(200).send({ message: "Listei todos os groupss do sistema!" });
  });
});
// Atualiza um groups especifico
route.put("/:id", (req, res, next) => {
  const id = req.params.id;
  mysql.getConnection((error, conn) => {
    conn.query(
      "UPDATE priority SET name=?,duration=?,responseTime=? WHERE id=?",
      [req.body.name, req.body.duration, req.body.responseTime, id],
      (error, resultado, field) => {
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        return res.status(202).send({
          message: "prioridade actualizada com sucesso!",
          Id: resultado.insertId,
        });
      }
    );
    conn.release();
  });
});
// Apaga um groups especifico
route.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  mysql.getConnection((error, conn) => {
    conn.query(
      "DELETE FROM priority WHERE id=?",
      [id],
      (error, resultado, field) => {
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        return res.status(202).send({
          message: "groups apagado com sucesso!",
          Id: resultado.id,
        });
      }
    );
    conn.release();
  });
});
module.exports = route;
