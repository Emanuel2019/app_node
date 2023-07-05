const express = require('express');
const route = express.Router();

const tasksGetAll=require('../controller/tasks/getAll');
const tasksGeId=require('../controller/tasks/getId');
const tasksCreate=require('../controller/tasks/create');
const tasksUpdate=require('../controller/tasks/update');
const tasksDelete=require('../controller/tasks/delete');
const autenticado = require('../middleware/login');
// Lista todos os tarefaes
route.get('/',autenticado.obrigatorio, tasksGetAll);
// Regista um novo tarefa
route.post('/',autenticado.obrigatorio, tasksCreate);

// Lista um tarefa especifico
route.get('/:id',autenticado.obrigatorio,tasksGeId);
// Atualiza um tarefa especifico
route.put('/:id',autenticado.obrigatorio, tasksUpdate);
// Apaga um tarefa especifico
route.delete('/:id',autenticado.obrigatorio,tasksDelete );
module.exports = route;
