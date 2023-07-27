const mysql = require("../mysql");
const { body, validationResult } = require('express-validator');
const Pusher = require("pusher");
const fs = require('fs');
const path = require('path');
const pusher = new Pusher({
    appId: "1636801",
    key: "44ff09de68fa52623d22",
    secret: "2c11e7f6d816dcf20694",
    cluster: "sa1",
    useTLS: true
});
const update = async (req, res, next) => {
    const id = req.params.id;
    const active=1;
    const currentDate = new Date();
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
        created_at, 
        updated_at 
    } = req.body;
    
    const select_id = `SELECT *FROM tasks WHERE id=${id}`;
    const resu = await mysql.execute(select_id);

    if (resu == "") {
        return res.status(500).sdmfgFFG({
            message: ` Este tarefa não existe... `,
        });
    }
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }

        const query = "UPDATE tasks SET name=?,description=?,user_id=?,client_id=?,type_id=?,group_id=?,area_id=?,status_id=?,channel_id=?,active=?,updated_at=? WHERE id=?";
        const result = await mysql.execute(query,
            [name, description, user_id, client_id, type_id, group_id, area_id, status_id, channel_id, active, currentDate, id]
        );

        const select_tasks = `SELECT  filename FROM files WHERE task_id=${id}`;
        const resut_id = await mysql.execute(select_tasks);

        const files = req.files;
        if (resut_id == "" && files && files.length > 0) {
            if (files && files.length > 0) {

                for (const file of files) {
                    const filename = file.filename;
                    const fileQuery = `
                INSERT INTO files (filename, task_id,created_at, updated_at)
                VALUES ( ?,?, ?, ?)
              `;
                    const resu = await mysql.execute(fileQuery, [filename, id, currentDate, currentDate]);

                }
            }
        } else {

            if (files && files.length > 0) {
                const removeFiles = async () => {
                    const filenames = resut_id.map((row) => row.filename);
                    const folderPath = path.join('uploads/tasks');

                    const filePromises = filenames.map((fname) => {
                        const filePath = path.join(folderPath, fname);
                        if (!fs.existsSync(filePath)) {
                            console.error('Arquivo não encontrado:', filePath);
                            return Promise.resolve(); // Ignora a remoção se o arquivo não existir
                        }

                        return new Promise((resolve, reject) => {
                            fs.unlink(filePath, (err) => {
                                if (err) {
                                    console.error('Erro ao remover o arquivo:', err);
                                    reject(err);
                                } else {
                                    console.log(`Arquivo removido: ${filePath}`);
                                    resolve();
                                }
                            });
                        });
                    });

                    try {
                        await Promise.all(filePromises);
                        console.log('Todos os arquivos foram removidos com sucesso.');
                    } catch (err) {
                        console.error('Erro ao remover arquivos:', err);
                    }
                };

                removeFiles();
                const delete_tasks = ` DELETE FROM files WHERE task_id=${id}`;
                await mysql.execute(delete_tasks);
                for (const file of files) {
                    const filename = file.filename;

                    const fileQuery = `
                        INSERT INTO files (filename, task_id,created_at, updated_at)
                        VALUES ( ?,?, ?, ?)
                      `;
                    const resu = await mysql.execute(fileQuery, [filename, id, currentDate, currentDate]);

                }
            }
        }
        const dataUpdate = {
            name, user_id, client_id, type_id, group_id, area_id, status_id, channel_id, active, created_at, updated_at
        };
        pusher.trigger("my-channel", "my-event", {
            tasks: dataUpdate
        });
        res.status(201).send({
            message: "Tarefa actualizada com sucesso!",
            tasks: dataUpdate,
        });
    } catch (error) {
        res.status(500).send({
            error: error,
        });
    }

}
module.exports = [
    body('name')
        .notEmpty()
        .withMessage('O nome é obrigatório.')
        .isLength({ min: 6 })
        .withMessage('O nome deve ter no mínimo 6 caracteres.')
        .isLength({ max: 200 })
        .withMessage('O nome deve ter no máximo 200 caracteres.'),
    body('description')
        .notEmpty()
        .withMessage('A descrição é obrigatório.')
        .isLength({ min: 2 })
        .withMessage('O descrição deve ter no mínimo 6 caracteres.')
        .isLength({ max: 200 })
        .withMessage('O descrição deve ter no máximo 200 caracteres.'),

    body('client_id')
        .isNumeric()
        .withMessage('Digite valor númerico')
        .notEmpty()
        .withMessage('O cliente é obrigatório.')
        .isInt({ min: 1 })
        .withMessage('O valor do cliente é inválido.'),

    body('type_id')
        .notEmpty()
        .withMessage('O tipo é obrigatório.')
        .isNumeric()
        .withMessage('Digite valor númerico')
        .isInt({ min: 1 })
        .withMessage('O valor do tipo é inválido.'),

    body('group_id')
        .notEmpty()
        .withMessage('O grupo é obrigatório.')
        .isNumeric()
        .withMessage('Digite valor númerico')
        .isInt({ min: 1 })
        .withMessage('O valor do grupo é inválido.'),

    body('area_id')
        .notEmpty()
        .withMessage('A area é obrigatório.')
        .isNumeric()
        .withMessage('Digite valor númerico')
        .isInt({ min: 1 })
        .withMessage('O valor do grupo é inválido.'),

    body('status_id')
        .notEmpty()
        .withMessage('A estado é obrigatório.')
        .isNumeric()
        .withMessage('Digite valor númerico')
        .isNumeric()
        .withMessage('Digite valor númerico')
        .isInt({ min: 1 })
        .withMessage('O valor do estado é inválido.'),
    body('channel_id')
        .notEmpty()
        .withMessage('O canal é obrigatório.')
        .isNumeric()
        .withMessage('Digite valor númerico')
        .isInt({ min: 1 })
        .withMessage('O valor do canal é inválido.'),
    body('user_id')
        .notEmpty()
        .withMessage('O utilizador é obrigatório.')
        .isNumeric()
        .withMessage('Digite valor númerico')
        .isInt({ min: 1 })
        .withMessage('O valor do utilizador é inválido.')
    ,

    update,
];