const express= require('express');
const route= express.Router();
const channelGetAll=require('../controller/channels/getAll');
const channelGetId=require('../controller/channels/getId');
const channelCreate=require('../controller/channels/create');
const channelUpdate=require('../controller/channels/update');
const channelDelete=require('../controller/channels/delete')
const authentication=require('../middleware/login');
// Lista todos os Canales
route.get('/',authentication.obrigatorio,channelGetAll);
// Regista um novo Canal
route.post('/',authentication.obrigatorio,channelCreate);
// Lista um Canal especifico
route.get('/:id',authentication.obrigatorio,channelGetId);
// Atualiza um Canal especifico
route.put('/:id',authentication.obrigatorio,channelUpdate);
// Apaga um Canal especifico
route.delete('/:id', authentication.obrigatorio,channelDelete);

module.exports = route;
