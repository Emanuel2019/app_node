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
        const query =  "UPDATE replies SET user_id = ?, task_id = ?, message = ? WHERE id = ?";
        const result = await mysql.execute(query,   [req.body.user_id, req.body.task_id, req.body.message, id]);
        return res.status(200).send({
            message: "Resposta atualizado com sucesso!",
            id: id,
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