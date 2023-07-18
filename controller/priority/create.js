const mysql = require("../mysql");
const { body, validationResult } = require('express-validator');
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1636801",
    key: "44ff09de68fa52623d22",
    secret: "2c11e7f6d816dcf20694",
    cluster: "sa1",
    useTLS: true
});
const create = async (req, res, next) => {
    const currentDate = new Date();
    const active = 1;
    const { name, duration, responseTime } = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const query = "INSERT INTO priority (name,duration,responseTime,active,created_at,updated_at) VALUES (?,?,?,?,?,?)";
        const result = await mysql.execute(query, [name, duration, responseTime, active, currentDate, currentDate]);
        const id = result.insertId;
        dataInsert = {
            id, name, duration, responseTime
        }
        pusher.trigger("my-channel", "my-event", {
            prioridade: dataInsert
        });
        res.status(201).send({
            message: "Prioridade registada com sucesso!",
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
        .isLength({ min: 4 })
        .withMessage('O nome deve ter no mínimo 4 caracteres')
        .isLength({ max: 200 })
        .withMessage('O nome deve ter no máximo 200 caracteres')
    ,
    create,
];
