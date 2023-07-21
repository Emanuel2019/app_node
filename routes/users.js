const express = require('express');
const route = express.Router();
const multer = require('multer');
const path = require('path');
const createUser = require('../controller/users/create');
const getAllteUser = require('../controller/users/getAll');
const userList = require('../controller/users/userList');
const getIdUser = require('../controller/users/getId');
const updateUser = require('../controller/users/update');
const deleteUser = require('../controller/users/delete')
const loginUser = require('../controller/users/login')
const autenticado = require('../middleware/login');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve('uploads/users'));
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
  });
  const upload = multer({ storage }).single('file');
// Lista todos os utilizadores
route.get('/',  getAllteUser);
route.get('/userlist',userList);
// Regista um novo utilizador
route.post('/', autenticado.obrigatorio,upload,createUser);

// Lista um utilizador especifico
route.get('/:id', autenticado.obrigatorio, getIdUser);
// Atualiza um utilizador especifico
route.put('/:id',autenticado.obrigatorio,upload,  updateUser);

// Apaga um utilizador especifico
route.delete('/:id', autenticado.obrigatorio, deleteUser);
route.post('/login', loginUser);
module.exports = route;
