const express = require("express");
const route = express.Router();
const mysql = require("../mysql").pool;
// Lista todos os areaes
route.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(`SELECT * FROM areas`, (error, result, field) => {
      conn.release();
      if (error) {
        return res.status(500).send({
          error: error,
        });
      }
      const areas = result.map((area) => {
        return {
          id: area.id,
          name: area.name,
          description: area.description,
          created_at: area.created_at,
          updated_at: area.updated_at,
        };
      });
      return res.status(200).send({
        areas: areas,
      });
    });
    //   res.status(200).send({ message: "Listei todos os areas do sistema!" });
  });
});
// Regista um novo area
route.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      "INSERT INTO areas (name,description,active,group_id) VALUES (?,?,?,?)",
      [req.body.name, req.body.description, req.body.active, req.body.group_id],
      (error, resultado, field) => {
        if (error) {
          res.status(500).send({
            error: error,
          });
        } else {
          res.status(201).send({
            message: "Area registada com sucesso!",
            Id: resultado.insertId,
          });
        }
        conn.release();
      }
    );
  });
});
// Lista um area especifico
route.get("/:id", (req, res, next) => {
  const id = req.params.id;
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(
      `SELECT * FROM areas WHERE id = ?`,
      [id],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        if (result.length == 0) {
          return res.status(404).send({
            message: "Area não encontrada!",
          });
        }
        const area = result.map((area) => {
          return {
            id: area.id,
            name: area.name,
            description: area.description,
            created_at: area.created_at,
            updated_at: area.updated_at,
          };
        });
        return res.status(200).send({
          area: area,
        });
      }
    );
  });
});

// Atualiza um area especifico
route.put("/:id", (req, res, next) => {
  const id = req.params.id;

  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(
      `UPDATE areas SET name = ?, description = ?, active = ?, group_id = ?,updated_at=Now() WHERE id = ?`,
      [
        req.body.name,
        req.body.description,
        req.body.active,
        req.body.group_id,
        id,
      ],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        if (result.affectedRows == 0) {
          return res.status(404).send({
            message: "Area não encontrada!",
          });
        }
        return res.status(200).send({
          message: "Area atualizada com sucesso!",
          areas: result.insertId,
        });
      }
    );
  });
});
// Apaga um area especifico
route.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(
      `DELETE FROM areas WHERE id = ?`,
      [id],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        if (result.affectedRows == 0) {
          return res.status(404).send({
            message: "Area não encontrada!",
          });
        }
        return res.status(200).send({
          message: "Area apagada com sucesso!",
          areas: result.insertId,
        });
      }
    );
  });
});
module.exports = route;
