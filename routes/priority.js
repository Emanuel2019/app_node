const express = require("express");
const route = express.Router();

const prioriryGetAll=require('../controller/priority/getAll');
const priorityGetId=require('../controller/priority/getId');
const priorityCreate=require('../controller/priority/create');
const priorityUpdate=require('../controller/priority/update');
const priorityDelete=require('../controller/priority/delete');


// Lista todos os groupses
route.get("/", prioriryGetAll);

// Regista um novo groups
route.post("/", priorityCreate);
// Lista um groups especifico
route.get("/:id", priorityGetId);
// Atualiza um groups especifico
route.put("/:id", priorityUpdate);
// Apaga um groups especifico
route.delete("/:id", priorityDelete);
module.exports = route;
