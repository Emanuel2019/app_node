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

      conn.query(`SELECT * FROM groups_users`, (error, result, field) => {
          conn.release();
          if (error) {
              return res.status(500).send({
                  error: error,
              });
          }

          const groups = result.map((group) => {
              return {
                  id: group.id,
                  group_id: group.group_id,
                  user_id:group.user_id,
                  created_at: group.created_at,
                  updated_at: group.updated_at,
              };
          });

          return res.status(200).send({
              groups: groups,
          });
      });
  });
});


// Regista um novo groups
route.post("/", (req, res, next) => {
  const currentDate=new Date();
  mysql.getConnection((error, conn) => {
    conn.query(
      "INSERT INTO groups_users (user_id,group_id,created_at,updated_at) VALUES (?,?,?,?)",
      [req.body.user_id, req.body.group_id, currentDate,currentDate ],
      (error, resultado, field) => {
        if (error) {
          res.status(500).send({
            error: error,
          });
        } else {
          res.status(201).send({
            message: "groups registado com sucesso!",
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
      `SELECT * FROM groups_users WHERE id = ?`,
      [id],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        const groups = result.map((groups) => {
          return {
            id: groups.id,
            group_id: groups.group_id,
            user_id:groups.user_id,
            created_at: groups.created_at,
            updated_at: groups.updated_at,
          };
        });
        return res.status(200).send({
          groups: groups,
        });
      }
    );
    //   res.status(200).send({ message: "Listei todos os groupss do sistema!" });
  });
});
// Atualiza um groups especifico
route.put("/:id", (req, res, next) => {
  const id = req.params.id;
  const currentDate=new Date();
  mysql.getConnection((error, conn) => {
    conn.query(
      "UPDATE groups_users SET user_id=?,group_id=?,updated_at=? WHERE id=?",
      [req.body.user_id, req.body.group_id, currentDate, id],
      (error, resultado, field) => {
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        return res.status(202).send({
          message: "groups actualizado com sucesso!",
          Id: resultado.id,
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
      "DELETE FROM groups_users WHERE id=?",
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
