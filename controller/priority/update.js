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
const update = async (req, res, next) => {
    const id = req.params.id;
    const {name, duration,responseTime}=req.body;
    const select_id = `SELECT * FROM priority WHERE  id=${id}`;
    const resu = await mysql.execute(select_id);

    if (resu == "") {
        return res.status(500).send({
            message: ` Essa prioridade não existe... `,
        });
    }
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const query =  "UPDATE priority SET name=?,duration=?,responseTime=? WHERE id=?";
        const result = await mysql.execute(query,  [name, duration,responseTime, id]);
        dataUpdate={id,name, duration,responseTime};
        pusher.trigger("my-channel", "my-event", {
            prioridade: dataUpdate
        });
        return res.status(202).send({
            message: "prioridade actualizada com sucesso!",
            prioridade: dataUpdate,
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
    update,
];