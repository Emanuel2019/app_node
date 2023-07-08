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
        const query ="UPDATE files SET filename = ?, task_id = ?, reply_id = ? WHERE id = ?";
        const result = await mysql.execute(query, [req.body.filename, req.body.task_id, req.body.reply_id, id]);
        return res.status(200).send({
            message: "Ficheiro actualizado com sucesso!",
            Id: result.id,
        });
    } catch (error) {
        return res.status(500).send({
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
  

    update,
];