const express = require("express");
const route = express.Router();
const autenticado = require('../middleware/login');
const mysql = require("../mysql").pool;
const areasgetAll=require('../controller/areas/getAll');
const areasGetId=require('../controller/areas/getId');
const areasCreate=require('../controller/areas/create');
const areasUpdate=require('../controller/areas/update');
const areasDelete=require('../controller/areas/delete');

// Lista todos os areaes
route.get("/",autenticado.obrigatorio,areasgetAll );
// Regista um novo area
route.post("/",autenticado.obrigatorio,areasCreate);

// Lista um area especifico
route.get("/:id",autenticado.obrigatorio,areasGetId);

// Atualiza um area especifico
route.put("/:id",autenticado.obrigatorio,areasUpdate );
// Apaga um area especifico
route.delete("/:id",autenticado.obrigatorio,areasDelete );
module.exports = route;
