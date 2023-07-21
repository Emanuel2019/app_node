const express= require('express');
const route= express.Router();
const multer = require('multer');
const path = require('path');
const clientGetAll=require('../controller/clients/getAll');
const clientGetId=require('../controller/clients/getId');
const clientCreate=require('../controller/clients/create');
const clientUpdate=require('../controller/clients/update');
const clientDelete=require('../controller/clients/delete');

const autenticado = require('../middleware/login');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve('uploads/clients'));
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
  });
  const upload = multer({ storage }).single('file');
// Lista todos os clientes
route.get('/',autenticado.obrigatorio,clientGetAll);
// Regista um novo cliente
route.post('/',autenticado.obrigatorio,upload, clientCreate);
// Lista um cliente especifico
route.get('/:id',autenticado.obrigatorio,clientGetId);
// Atualiza um cliente especifico
route.put('/:id',autenticado.obrigatorio,upload,clientUpdate);
// Apaga um cliente especifico
route.delete('/:id',autenticado.obrigatorio,clientDelete);
module.exports = route;
