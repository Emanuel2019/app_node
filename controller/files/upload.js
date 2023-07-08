const mysql = require("../mysql");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage }).array('files');
console.log(upload);
const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

const uploadFile = async (req, res, next) => {
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

module.exports = uploadFile;
