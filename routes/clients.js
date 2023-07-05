const express= require('express');
const route= express.Router();
const clientGetAll=require('../controller/clients/getAll');
const clientGetId=require('../controller/clients/getId');
const clientCreate=require('../controller/clients/create');
const clientUpdate=require('../controller/clients/update');
const clientDelete=require('../controller/clients/delete');
const autenticado = require('../middleware/login');
// Lista todos os clientees
route.get('/',autenticado.obrigatorio,clientGetAll);
// Regista um novo cliente
route.post('/',autenticado.obrigatorio, clientCreate);
// Lista um cliente especifico
route.get('/:id',autenticado.obrigatorio,clientGetId);
// Atualiza um cliente especifico
route.put('/:id',autenticado.obrigatorio,clientUpdate);
// Apaga um cliente especifico
route.delete('/:id',autenticado.obrigatorio,clientDelete);
module.exports = route;
