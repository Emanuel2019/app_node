const mysql = require("../mysql");
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1636801",
    key: "44ff09de68fa52623d22",
    secret: "2c11e7f6d816dcf20694",
    cluster: "sa1",
    useTLS: true
});
const { body, validationResult } = require('express-validator');
const update = async (req, res, next) => {
    const id = req.params.id;
    const currentDate = new Date();
    const { name, description, color } = req.body;
    const select_id = `SELECT * FROM status WHERE idid=${id}`;
    const resu = await mysql.execute(select_id);

    if (resu == "") {
        return res.status(500).send({
            message: ` Este estado não existe... `,
        });
    }
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const query = "UPDATE status SET name = ?, description = ?, color = ?,updated_at=? WHERE id = ?";
        const result = await mysql.execute(query, [name, description, color, currentDate, id]);
        const dataUpdate = {
            id, name, description, color, currentDate
        }
        pusher.trigger("my-channel", "my-event", {
            estdo: dataUpdate
        });
        return res.status(200).send({
            message: "status atualizado com sucesso!",
            status: {
                id: id,
                nome: req.body.name,
                descrição: req.body.description,
                color: req.body.color

            },
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
    body('color')
        .notEmpty()
        .withMessage('A color é obrigatória.')
        .isLength({ min: 4 })
        .withMessage('A color deve ter no mínimo 4 caracteres')
        .isLength({ max: 7 })
        .withMessage('A color deve ter no máximo 7 caracteres'),


    update,
];