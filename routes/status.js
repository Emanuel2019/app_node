const express = require("express");
const route = express.Router();
const statusGetAll=require('../controller/status/getAll');
const statusGetId=require('../controller/status/getId');
const statusCreate=require('../controller/status/create');
const statusUpdate=require('../controller/status/update');
const statusDelete=require('../controller/status/delete');
const autenticado = require('../middleware/login');
const mysql = require("../mysql").pool;
// Lista todos os estadoes
route.get("/",autenticado.obrigatorio, statusGetAll);
// Regista um novo estado
route.post("/", statusCreate);
// Lista um estado especifico
route.get("/:id",statusGetId);
// Atualiza um estado especifico
route.put("/:id",statusUpdate);
// Apaga um estado especifico
route.delete("/:id",statusDelete);
module.exports = route;
