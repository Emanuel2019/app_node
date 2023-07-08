const mysql = require("../mysql");
const { body, validationResult } = require('express-validator');
const create=async(req, res, next) => {
    const currentDate = new Date();
   
    const active = 1;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const query=   "INSERT INTO groups_users (user_id,group_id,created_at,updated_at) VALUES (?,?,?,?)";
        const result=await mysql.execute(query, [req.body.user_id, req.body.group_id, currentDate,currentDate ]);
        res.status(201).send({
            message: "Grupos de utilizadores registado com sucesso!",
            Id: result.insertId,
        });
    } catch (error) {
        res.status(500).send({
            error: error,
        });
    }
    
}
module.exports = [
    body('group_id')
    .notEmpty()
    .withMessage('O grupo  é obrigatório.')
    .isInt({ min: 1 })
    .withMessage('O valor do grupo é inválido.')
    ,

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
