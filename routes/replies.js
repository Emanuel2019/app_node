const express = require('express');
const route = express.Router();
const mysql = require("../mysql").pool;
const replayGetAll=require('../controller/replies/getAll');
const replayGetId=require('../controller/replies/getId');
const replayCreate=require('../controller/replies/create');
const replayUpdate=require('../controller/replies/update');
const replayDelete=require('../controller/replies/delete');
const autenticado = require('../middleware/login');
// Lista todos os tipoes
route.get('/',autenticado.obrigatorio, replayGetAll);
// Regista um novo tipo
route.post('/',autenticado.obrigatorio, replayCreate);

// Lista um tipo especifico
route.get('/:id',autenticado.obrigatorio, replayGetId);
// Atualiza um tipo especifico
route.put('/:id',autenticado.obrigatorio,replayUpdate );

// Apaga um tipo especifico
route.delete('/:id',autenticado.obrigatorio,replayDelete);

module.exports = route;
