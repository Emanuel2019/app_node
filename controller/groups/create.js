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
    const active = 1;
    const {name, description,user_id}=req.body
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const query= "INSERT INTO \`groups\` (name,description,user_id,created_at,updated_at) VALUES (?,?,?,?,?)";
        const result=await mysql.execute(query, [name, description,user_id, currentDate,currentDate] );
       const group_id=result.insertId;
        dataInsert={
          group_id,  name, description,user_id
        };
        pusher.trigger("my-channel", "my-event", {
            grupo: dataInsert
        });
        res.status(201).send({
            message: "groups registado com sucesso!",
            groups:  dataInsert,
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

    body('description')
        .notEmpty()
        .withMessage('A descrição é obrigatória.')
        .isLength({ min: 4 })
        .withMessage('O descrição deve ter no mínimo 4 caracteres')
        .isLength({ max: 200 })
        .withMessage('O descrição deve ter no máximo 200 caracteres'),
  

    create,
];
