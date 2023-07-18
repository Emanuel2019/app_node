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
const create=async(req, res, next) => {
    const currentDate = new Date();
   const {user_id,group_id}=req.body;
    const active = 1;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const query=   "INSERT INTO groups_users (user_id,group_id,created_at,updated_at) VALUES (?,?,?,?)";
        const result=await mysql.execute(query, [user_id,group_id, currentDate,currentDate ]);
        const groupUser_id=result.insertId;
        dataInsert={
            groupUser_id,user_id,group_id, currentDate
          };
        pusher.trigger("my-channel", "my-event", {
            group_user: dataInsert
        });
        res.status(201).send({
            message: "Grupos de utilizadores registado com sucesso!",
            groups_users:dataInsert,
        });
    } catch (error) {
        res.status(500).send({
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

    create,
];
