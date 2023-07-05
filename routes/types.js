const express = require('express');
const route = express.Router();
const mysql = require("../mysql").pool;
const typeGetAll=require('../controller/types/getAll');
const typeGetId=require('../controller/types/getId');
const typeCreate=require('../controller/types/create');
const typeUpdate=require('../controller/types/update');
const typeDelete=require('../controller/types/delete');
const autenticado = require('../middleware/login');
// Lista todos os tipoes
route.get('/',autenticado.obrigatorio,typeGetAll);
// Regista um novo tipo
route.post('/',autenticado.obrigatorio,typeCreate);

// Lista um tipo especifico
route.get('/:id',autenticado.obrigatorio,typeGetId);
// Atualiza um tipo especifico
route.put('/:id',autenticado.obrigatorio,typeUpdate );

// Apaga um tipo especifico
route.delete('/:id',autenticado.obrigatorio,typeDelete);

module.exports = route;
