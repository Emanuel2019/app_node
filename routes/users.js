const express = require('express');
const route = express.Router();
const createUser = require('../controller/users/create');
const getAllteUser = require('../controller/users/getAll');
const getIdUser = require('../controller/users/getId');
const updateUser = require('../controller/users/update');
const deleteUser = require('../controller/users/delete')
const loginUser = require('../controller/users/login')
const autenticado = require('../middleware/login');
// Lista todos os utilizadores
route.get('/', autenticado.obrigatorio, getAllteUser);

// Regista um novo utilizador
route.post('/', autenticado.obrigatorio,createUser);

// Lista um utilizador especifico
route.get('/:id', autenticado.obrigatorio, getIdUser);
// Atualiza um utilizador especifico
route.put('/:id', autenticado.obrigatorio, updateUser);

// Apaga um utilizador especifico
route.delete('/:id', autenticado.obrigatorio, deleteUser);
route.post('/login', loginUser);
module.exports = route;
