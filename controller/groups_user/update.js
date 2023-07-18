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
    const {user_id,group_id}=req.body;
    const select_id = `SELECT id,user_id,group_id from  groups_users  WHERE id=${id}`;
    const resu = await mysql.execute(select_id);

    if (resu == "") {
        return res.status(500).send({
            message: ` Este grupo de utilizadores não existe... `,
        });
    }
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const query =  "UPDATE groups_users SET user_id=?,group_id=?,updated_at=? WHERE id=?";
        const result = await mysql.execute(query,  [user_id,group_id, currentDate, id]);
        dataUpdate={
            id,user_id,group_id,currentDate
        }
        pusher.trigger("my-channel", "my-event", {
            group_user: dataUpdate
        });
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