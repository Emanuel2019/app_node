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
    const currentDate=new Date();
    const {name, description, user_id}=req.body;
    const select_id = `SELECT id,name from  \`groups\`  WHERE id=${id}`;
    const resu = await mysql.execute(select_id);

    if (resu == "") {
        return res.status(500).send({
            message: ` Este grupo não existe... `,
        });
    }
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const query =  "UPDATE \`groups\` SET name=?,description=?,user_id=?,updated_at=? WHERE id=?";
        const result = await mysql.execute(query,  [name, description, user_id,currentDate, id]);
        dataUpdate={
            id,  name, description,user_id,currentDate
          };
          pusher.trigger("my-channel", "my-event", {
            grupo: dataUpdate
        });
        return res.status(200).send({
            message: "groups actualizado com sucesso!",
            Id: id,
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