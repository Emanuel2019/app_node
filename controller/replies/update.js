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
const update = async (req, res, next) => {
    const id = req.params.id;
    const currentDate = new Date();
    const { user_id, task_id, message } = req.body;
    const select_id = `SELECT replies.id, replies.user_id, users.name AS user_name, replies.task_id, tasks.name AS task_name, replies.message, replies.created_at, replies.updated_at
    FROM replies
    JOIN users ON replies.user_id = users.id
    JOIN tasks ON replies.task_id = tasks.id WHERE replies.id=${id}`;
    const resu = await mysql.execute(select_id);

    if (resu == "") {
        return res.status(500).send({
            message: ` Essa resposta não existe... `,
        });
    }
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const query = "UPDATE replies SET user_id = ?, task_id = ?, message = ?,updated_at=? WHERE id = ?";
        const result = await mysql.execute(query, [user_id, task_id, message, currentDate, id]);
        dataUpdate = {
            id, user_id, task_id, message, currentDate
        };
        pusher.trigger("my-channel", "my-event", {
            resposta: dataUpdate
        });
        return res.status(200).send({
            message: "Resposta atualizado com sucesso!",
            resposta: dataUpdate,
        });
    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }

}
module.exports = [


    body('message')
        .notEmpty()
        .withMessage('A descrição é obrigatória.')
        .isLength({ min: 4 })
        .withMessage('O descrição deve ter no mínimo 4 caracteres')
        .isLength({ max: 200 })
        .withMessage('O descrição deve ter no máximo 200 caracteres'),


    update,
];