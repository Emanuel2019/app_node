const express = require("express");
const route = express.Router();
const groupsGetAll=require('../controller/groups_user/getAll');
const groupsGetId=require('../controller/groups_user/getId');
const groupsCreate=require('../controller/groups_user/create');
const groupsUpdate=require('../controller/groups_user/update');
const groupsDelete=require('../controller/groups_user/delete');
const authentication=require('../middleware/login');
// Lista todos os groupses
route.get("/",authentication.obrigatorio,groupsGetAll);


// Regista um novo groups
route.post("/", authentication.obrigatorio,groupsCreate);
// Lista um groups especifico
route.get("/:id", authentication.obrigatorio,groupsGetId);
// Atualiza um groups especifico
route.put("/:id", authentication.obrigatorio,groupsUpdate);
// Apaga um groups especifico
route.delete("/:id", authentication.obrigatorio,groupsDelete);
module.exports = route;
