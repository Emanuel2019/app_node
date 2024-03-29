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

      conn.query(`SELECT * FROM \`groups\``, (error, result, field) => {
          conn.release();
          if (error) {
              return res.status(500).send({
                  error: error,
              });
          }

          const groups = result.map((group) => {
              return {
                  id: group.id,
                  name: group.name,
                  description: group.description,
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
      "INSERT INTO \`groups\` (name,description,user_id,created_at,updated_at) VALUES (?,?,?,?,?)",
      [req.body.name, req.body.description, req.body.user_id, currentDate,currentDate ],
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
      `SELECT * FROM \`groups\` WHERE id = ?`,
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
            name: groups.name,
            description: groups.description,
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
  mysql.getConnection((error, conn) => {
    conn.query(
      "UPDATE \`groups\` SET name=?,description=?,user_id=? WHERE id=?",
      [req.body.name, req.body.description, req.body.user_id, id],
      (error, resultado, field) => {
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        return res.status(202).send({
          message: "groups actualizado com sucesso!",
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
      "DELETE FROM \`groups\` WHERE id=?",
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
