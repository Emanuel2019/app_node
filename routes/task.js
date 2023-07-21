const express = require('express');
const route = express.Router();
const multer = require('multer');
const path = require('path');
const tasksGetAll=require('../controller/tasks/getAll');
const tasksGeId=require('../controller/tasks/getId');
const tasksCreate=require('../controller/tasks/create');
const tasksUpdate=require('../controller/tasks/update');
const tasksDelete=require('../controller/tasks/delete');
const autenticado = require('../middleware/login');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve('uploads/tasks'));
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
  });
  const upload = multer({ storage }).array('files',3);
// Lista todos os tarefaes
route.get('/',autenticado.obrigatorio, tasksGetAll);
// Regista um novo tarefa
route.post('/',autenticado.obrigatorio,  upload, tasksCreate);
// Lista um tarefa especifico
route.get('/:id',autenticado.obrigatorio,tasksGeId);
// Atualiza um tarefa especifico
route.put('/:id',autenticado.obrigatorio, upload,tasksUpdate);
route.post('/:id',autenticado.obrigatorio,upload, tasksUpdate);
// Apaga um tarefa especifico
route.delete('/:id',autenticado.obrigatorio,tasksDelete );
module.exports = route;
