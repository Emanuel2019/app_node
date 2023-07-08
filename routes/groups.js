const express = require("express");
const route = express.Router();
const mysql = require("../mysql").pool;
const groupsGetAll=require('../controller/groups/getAll');
const groupsGetId=require('../controller/groups/getId');
const groupsCreate=require('../controller/groups/create');
const groupsUpdate=require('../controller/groups/update');
const groupsDelete=require('../controller/groups/delete')
const authentication=require('../middleware/login');
// Lista todos os groupses
route.get("/",authentication.obrigatorio,groupsGetAll );
// Regista um novo groups
route.post("/", authentication.obrigatorio,groupsCreate);
// Lista um groups especifico
route.get("/:id", authentication.obrigatorio,groupsGetId);
// Atualiza um groups especifico
route.put("/:id",authentication.obrigatorio,groupsUpdate);
// Apaga um groups especifico
route.delete("/:id",authentication.obrigatorio,groupsDelete);
module.exports = route;
