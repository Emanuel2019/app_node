const mysql = require("../mysql");
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage }).array('files');
const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

const create = async (req, res, next) => {
  try {
    await upload(req, res, (err) => {
      if (err) {
        console.error('Erro ao fazer upload de arquivos: ' + err);
        return res.status(500).json({ error: 'Erro ao fazer upload de arquivos.' });
      }

      const file = req.files[0];
      const name = req.body.name;
      const task_id = req.body.task_id;

      const taskQuery = "INSERT INTO tasks (name, description, user_id, client_id, type_id, group_id, area_id, status_id, channel_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      mysql.execute(taskQuery, [
        name,
        req.body.description,
        req.body.user_id,
        req.body.client_id,
        req.body.type_id,
        req.body.group_id,
        req.body.area_id,
        req.body.status_id,
        req.body.channel_id,
        currentDate,
        currentDate,
      ], (err, taskResult) => {
        if (err) {
          console.error('Erro ao inserir a tarefa: ' + err.stack);
          return res.status(500).json({ error: 'Erro ao inserir a tarefa.' });
        }

        const taskId = taskResult.insertId;

        // Inserir o arquivo na tabela "files"
        const fileQuery = 'INSERT INTO files (filename, task_id, created_at, updated_at) VALUES (?, ?, ?, ?)';
        mysql.execute(fileQuery, [file.filename, taskId, currentDate, currentDate], (err) => {
          if (err) {
            console.error('Erro ao inserir o arquivo: ' + err.stack);
            return res.status(500).json({ error: 'Erro ao inserir o arquivo.' });
          }

          res.send({
            success: true,
            message: 'Arquivo enviado!'
          });
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: 'Erro ao enviar o arquivo'
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