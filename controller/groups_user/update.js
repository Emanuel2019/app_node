const mysql = require("../mysql");
const { body, validationResult } = require('express-validator');
const update = async (req, res, next) => {
    const id = req.params.id;
    const currentDate = new Date();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const query =  "UPDATE groups_users SET user_id=?,group_id=?,updated_at=? WHERE id=?";
        const result = await mysql.execute(query,  [req.body.user_id, req.body.group_id, currentDate, id]);
        return res.status(200).send({
            message: "Grupos de utilizadores actualizado com sucesso!",
            Id: id,
        });
    } catch (error) {
        return res.status(500).send({
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
  

    update,
];