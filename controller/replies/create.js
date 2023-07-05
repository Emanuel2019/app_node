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
        const query= "INSERT INTO replies (user_id, task_id, message, created_at,updated_at) VALUES (?, ?, ?, ?,?)";
        const result=await mysql.execute(query, [
            req.body.user_id,
            req.body.task_id,
            req.body.message,
            currentDate,
            currentDate,
        ]);
        res.status(201).send({
            message: " Resposta registado com sucesso!",
            Id: result.insertId,
        });
    } catch (error) {
        res.status(500).send({
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
  

    create,
];
