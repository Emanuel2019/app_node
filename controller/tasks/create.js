const mysql = require("../mysql");
const { body, validationResult } = require('express-validator');
const create = async (req, res, next) => {
    const currentDate = new Date();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const query = "INSERT INTO tasks (name, description, user_id, client_id, type_id, group_id, area_id, status_id, channel_id, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const result = await mysql.execute(query,
            [
                req.body.name,
                req.body.description,
                req.body.user_id,
                req.body.client_id,
                req.body.type_id,
                req.body.group_id,
                req.body.area_id,
                req.body.status_id,
                req.body.channel_id,
                req.body.active,
                currentDate,
                currentDate,
            ]
        );
        res.status(201).send({
            message: "Tarefa registada com sucesso!",
            Id: result.insertId,
        });
    } catch (error) {
        return res.status(500).send({
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