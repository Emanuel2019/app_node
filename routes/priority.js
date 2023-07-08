const express = require("express");
const route = express.Router();
const prioriryGetAll=require('../controller/priority/getAll');
const priorityGetId=require('../controller/priority/getId');
const priorityCreate=require('../controller/priority/create');
const priorityUpdate=require('../controller/priority/update');
const priorityDelete=require('../controller/priority/delete');
const authentication=require('../middleware/login');


// Lista todos os groupses
route.get("/",authentication.obrigatorio, prioriryGetAll);

// Regista um novo groups
route.post("/",authentication.obrigatorio, priorityCreate);
// Lista um groups especifico
route.get("/:id",authentication.obrigatorio, priorityGetId);
// Atualiza um groups especifico
route.put("/:id", authentication.obrigatorio,priorityUpdate);
// Apaga um groups especifico
route.delete("/:id",authentication.obrigatorio, priorityDelete);
module.exports = route;
