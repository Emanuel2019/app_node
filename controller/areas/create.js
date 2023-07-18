const { body, validationResult } = require('express-validator');
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1636801",
    key: "44ff09de68fa52623d22",
    secret: "2c11e7f6d816dcf20694",
    cluster: "sa1",
    useTLS: true
});
const mysql = require('../mysql');

const create = async (req, res, next) => {
    const currentDate = new Date();
    const { name, description, group_id } = req.body;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const query =
            'INSERT INTO areas (name, description, active, group_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)';
        const result = await mysql.execute(query, [
            name,
            description,
            1, // Ativo
            group_id,
            currentDate,
            currentDate
        ]);
        dataInsert={
            "name":name,
            "description":description,
            "Grupo":group_id,
            "data de criação":currentDate,
        }
        pusher.trigger("my-channel", "my-event", {
            areas: dataInsert
        });
        res.status(201).send({
            message: 'Área registrada com sucesso!',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).send({ error: error });
    }
};

module.exports = [
    body('name')
        .notEmpty()
        .withMessage('O nome é obrigatório.')
        .isLength({ min: 4 })
        .withMessage('O nome deve ter no mínimo 4 caracteres')
        .isLength({ max: 200 })
        .withMessage('O nome deve ter no máximo 200 caracteres')
    ,

    body('description')
        .notEmpty()
        .withMessage('A descrição é obrigatória.')
        .isLength({ min: 4 })
        .withMessage('O descrição deve ter no mínimo 4 caracteres')
        .isLength({ max: 200 })
        .withMessage('O descrição deve ter no máximo 200 caracteres'),
    body('group_id')
        .notEmpty()
        .withMessage('O grupo  é obrigatório.')
        .isInt({ min: 1 })
        .withMessage('O valor do grupo é inválido.')
    ,

    create,
];
