const mysql = require("../mysql");
const { body, validationResult } = require('express-validator');
const create = async (req, res, next) => {
    const currentDate = new Date();
    const active = 1;
    try {
        console.log(req.files);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const query = "INSERT INTO files (filename, task_id, reply_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)";
        const result = await mysql.execute(query, [
            req.body.filename,
            req.body.task_id,
            req.body.reply_id,
            currentDate,
            currentDate,
        ]);
        res.status(201).send({
            message: "Ficheiro registado com sucesso!",
            Id: result.insertId,
        });
    } catch (error) {
        res.status(500).send({
            error: error,
        });
    }

}
module.exports = [
    body('filename')
        .notEmpty()
        .withMessage('O nome é obrigatório.')
        .isLength({ min: 4 })
        .withMessage('O nome deve ter no mínimo 4 caracteres')
        .isLength({ max: 200 })
        .withMessage('O nome deve ter no máximo 200 caracteres')
    ,

    body('task_id')
        .notEmpty()
        .withMessage('A tarefa   é obrigatório.')
        .isInt({ min: 1 })
        .withMessage('O valor do Tarefa é inválido.')
        .isNumeric()
        .withMessage('Digite valor númerico')
    ,

    body('reply_id')
        .notEmpty()
        .withMessage('O Resposta é obrigatório.')
        .isInt({ min: 1 })
        .withMessage('O valor da resposta é inválido.')
        .isNumeric()
        .withMessage('Digite valor númerico')
    ,


    create,
];
