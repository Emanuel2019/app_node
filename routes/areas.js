const express = require("express");
const route = express.Router();
const mysql = require("../mysql").pool;
const Joi = require('joi');
const { validate, isLength, isBoolean, isInt, isISO8601 } = require('validator');
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
  const active = 1;
  const currentDate = new Date();
  const { name, description, group_id } = req.body;

  // Função para validar os campos
  function validateFields() {
    const errors = {};

    // Validação do campo "name"
   
    if (!isLength(name, { min: 1 })) {
      errors.name = "O campo 'name' é obrigatório.";
    } else if (!isLength(name, { min: 4 })) {
      errors.name = "O campo 'name' deve ter no mínimo 4 caracteres.";
    }
    // Validação do campo "description"
    if (!isLength(description, { min: 1 })) {
      errors.description = "O campo 'description' é obrigatório.";
    }

  else if (!isLength(description, { min: 4 })) {
    errors.description = "O campo descrição deve ter no mínimo 4 caracteres.";
  }
    

    // Validação do campo "group_id"
    if (!isInt(String(group_id), { min: 1 })) {
      errors.group_id = "Este deve conter um número inteiro positivo.";
    }

    

    return errors;
  }

  // Validando os campos
  const errors = validateFields();

  if (Object.keys(errors).length > 0) {
    res.status(400).send({ errors });
  } else {
    mysql.getConnection((err, conn) => {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        const query = "INSERT INTO areas (name, description, active, group_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)";
        const values = [name, description, active, group_id, currentDate, currentDate];

        conn.query(query, values, (err, result, fields) => {
          if (err) {
            res.status(500).send({ error: err });
          } else {
            res.status(201).send({
              message: "Área registrada com sucesso!",
              id: result.insertId
            });
          }
          conn.release();
        });
      }
    });
  }
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
  const { name, description, active, group_id } = req.body;

  // Função para validar os campos
  function validateFields() {
    const errors = {};

    // Validação do campo "name"
    if (!isLength(name, { min: 1 })) {
      errors.name = "O campo nome é obrigatório.";
    }
    else if(!isLength(name,{min:4})){
     errors.name = "O campo 'name' deve ter no mínimo 4 caracteres.";
    }

    // Validação do campo "description"
    if (!isLength(description, { min: 1 })) {
      errors.description = "O campo 'descrição' é obrigatório.";
    }
    else if (!isLength(description, { min: 4})) {
      errors.description = "O campo 'descrição' deve ter no mínimo 4 caracteres.";
    }


    // Validação do campo "active"
    if (!isBoolean(active)) {
      errors.active = "O campo 'active' deve ser do tipo booleano.";
    }

    // Validação do campo "group_id"
    if (!isInt(String(group_id), { min: 1 })) {
      errors.group_id = "O campo 'group_id' deve ser um número inteiro positivo.";
    }

    return errors;
  }

  // Validando os campos
  const errors = validateFields();

  if (Object.keys(errors).length > 0) {
    res.status(400).send({ errors });
  } else {
    mysql.getConnection((err, conn) => {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        // Verificar se a área existe antes de atualizar
        conn.query(
          "SELECT * FROM areas WHERE id = ?",
          [id],
          (error, results, fields) => {
            if (error) {
              conn.release();
              res.status(500).send({ error: error });
            } else if (results.length === 0) {
              conn.release();
              res.status(404).send({ message: "Área não encontrada!" });
            } else {
              // Atualizar os campos da área
              conn.query(
                `UPDATE areas SET name = ?, description = ?, active = ?, group_id = ?, updated_at = NOW() WHERE id = ?`,
                [name, description, active, group_id, id],
                (error, result, field) => {
                  conn.release();
                  if (error) {
                    res.status(500).send({ error: error });
                  } else {
                    res.status(200).send({
                      message: "Área actualizada com sucesso!",
                      areaId: id
                    });
                  }
                }
              );
            }
          }
        );
      }
    });
  }
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
