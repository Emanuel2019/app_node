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
    const { name, description } = req.body;
    const message = "Canal actualizado com sucesso!"
    const currentDate=new Date();
    const select_id = `SELECT id,name from channels WHERE id=${id}`;
    const resu = await mysql.execute(select_id);

    if (resu == "") {
        return res.status(500).send({
            message: ` Esse canal não existe `,
        });
    }
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const query = "UPDATE channels SET name = ?, description = ?,updated_at = ? WHERE id = ?";
        const result = await mysql.execute(query, [name, description,currentDate, id]);
        dataUpdate = {
            'id': id,
            'name': name,
            'descrption': description,
            'Data de actualização':currentDate,
            'msg_update': message
        }
        pusher.trigger("my-channel", "my-event", {
            canal: dataUpdate
        }); 
        return res.status(200).send({
            message: message,
            id: id,
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


    update,
];