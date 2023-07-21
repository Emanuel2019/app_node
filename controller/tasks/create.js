const mysql = require("../mysql");

const { body, validationResult } = require('express-validator');
const Pusher = require("pusher");
const pusher = new Pusher({
  appId: "1636801",
  key: "44ff09de68fa52623d22",
  secret: "2c11e7f6d816dcf20694",
  cluster: "sa1",
  useTLS: true
});


const create = async (req, res, next) => {
  const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const {
    name,
    description,
    user_id,
    client_id,
    type_id,
    group_id,
    area_id,
    status_id,
    channel_id,
  } = req.body;
  try {
    const query = "INSERT INTO tasks (name, description, user_id, client_id, type_id, group_id, area_id, status_id, channel_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const result = await mysql.execute(query, [
      name,
      description,
      user_id,
      client_id,
      type_id,
      group_id,
      area_id,
      status_id,
      channel_id,
      currentDate,
      currentDate,
    ]);

    const taskId = result.insertId;
    const file = req.files;
   
    if(file.length>0){
      for (const file of req.files) {
        const { filename } = file;
        const fileQuery = 'INSERT INTO files (filename, task_id, created_at, updated_at) VALUES (?, ?, ?, ?)';
        await mysql.execute(fileQuery, [filename, taskId, currentDate, currentDate]);
      }
    }
   
    const dataInsert = {
      taskId,
      name,
      description,
      user_id,
      client_id,
      type_id,
      group_id,
      area_id,
      status_id,
      channel_id,
      currentDate,
      
    };

    pusher.trigger("my-channel", "my-event", {
      tasks: dataInsert
    });
    res.send({
      success: true,
      message: dataInsert
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Erro ao carregar o anexo"
    });
  }
};
module.exports = [
  body('name')
    .notEmpty()
    .withMessage('O nome é obrigatório.')
    .isLength({ min: 6 })
    .withMessage('O nome deve ter no mínimo 6 caracteres.')
    .isLength({ max: 200 })
    .withMessage('O nome deve ter no máximo 200 caracteres.'),

  body('client_id')
    .notEmpty()
    .withMessage('O cliente é obrigatório.')
    .isInt({ min: 1 })
    .withMessage('O valor do cliente é inválido.')
    .isNumeric()
    .withMessage('Digite valor númerico'),

  body('type_id')
    .notEmpty()
    .withMessage('O tipo é obrigatório.')
    .isInt({ min: 1 })
    .withMessage('O valor do tipo é inválido.')
    .isNumeric()
    .withMessage('Digite valor númerico')
  ,

  body('group_id')
    .notEmpty()
    .withMessage('O grupo é obrigatório.')
    .isInt({ min: 1 })
    .withMessage('O valor do grupo é inválido.')
    .isNumeric()
    .withMessage('Digite valor númerico'),

  body('area_id')
    .notEmpty()
    .withMessage('A area é obrigatório.')
    .isInt({ min: 1 })
    .withMessage('O valor do grupo é inválido.')
    .isNumeric()
    .withMessage('Digite valor númerico'),

  body('status_id')
    .notEmpty()
    .withMessage('A estado é obrigatório.')
    .isInt({ min: 1 })
    .withMessage('O valor do estado é inválido.')
    .isNumeric()
    .withMessage('Digite valor númerico'),
  body('channel_id')
    .notEmpty()
    .withMessage('O canal é obrigatório.')
    .isInt({ min: 1 })
    .withMessage('O valor do canal é inválido.')
    .isNumeric()
    .withMessage('Digite valor númerico'),
  body('user_id')
    .notEmpty()
    .withMessage('O utilizador é obrigatório.')
    .isInt({ min: 1 })
    .withMessage('O valor do utilizador é inválido.')
    .isNumeric()
    .withMessage('Digite valor númerico')
  ,
  create,

];