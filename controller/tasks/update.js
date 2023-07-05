const mysql = require("../mysql");
const { body, validationResult } = require('express-validator');
const update = async (req, res, next) => {
    const id = req.params.id;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const query = "UPDATE tasks SET name=?,user_id=?,client_id=?,type_id=?,group_id=?,area_id=?,status_id=?,channel_id=?,active=?,created_at=?,updated_at=? WHERE id=?";
        const result = await mysql.execute(query,
            [req.body.name, req.body.user_id, req.body.client_id, req.body.type_id, req.body.group_id, req.body.area_id, req.body.status_id, req.body.channel_id, req.body.active, req.body.created_at, req.body.updated_at, id]
        );
        res.status(201).send({
            message: "Tarefa atualizada com sucesso!",
            Id: result.insertId,
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