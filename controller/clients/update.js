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
    const {reference, name, address, country, city, phone1, phone2, email1, email2, active, user_id}=req.body
    const select_id = `SELECT id,name from clients WHERE id=${id}`;
    const resu = await mysql.execute(select_id);

    if (resu == "") {
        return res.status(500).send({
            message: ` Este cliente não existe... `,
        });
    }
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const query = 'UPDATE clients SET reference=?,name=?,address=?,country=?,city=?,phone1=?,phone2=?,email1=?,email2=?,Active=?,user_id=? WHERE id=?';
        const result = await mysql.execute(query, [reference, name, address,country, city, phone1,phone2, email1, email2, active, user_id, id]);
        dataUpdate={
            reference, name, address,country, city, phone1,phone2, email1, email2, active, user_id, id
        }
        pusher.trigger("my-channel", "my-event", {
            client: dataUpdate
        }); 

        res.status(201).send({
            message: "Cliente atualizado com sucesso!",
            cliente:{
                id:id,
                reference:reference,
                nome:name,
                enderço:address,
                país:country,
                Cidade:city,
                Telefone1:phone1,
                Telefone_2:phone2,
                Email1:email1,
                Email2:email2,
                user_id:user_id
            } 
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
        .isLength({ min: 6 })
        .withMessage('O nome deve ter no mínimo 6 caracteres.')
        .isLength({ max: 200 })
        .withMessage('O nome deve ter no máximo 200 caracteres.'),

    body('address')
        .notEmpty()
        .withMessage('O endereço é obrigatório.')
        .isLength({ min: 6 })
        .withMessage('O endereço deve ter no mínimo 6 caracteres.')
        .isLength({ max: 200 })
        .withMessage('O endereço deve ter no máximo 200 caracteres.'),

    body('country')
        .notEmpty()
        .withMessage('O país é obrigatório.')
        .isLength({ min: 6 })
        .withMessage('O país deve ter no mínimo 6 caracteres.')
        .isLength({ max: 200 })
        .withMessage('O país deve ter no máximo 200 caracteres.'),

        body('city')
        .notEmpty()
        .withMessage('O cidade é obrigatório.')
        .isLength({ min: 6 })
        .withMessage('A cidade deve ter no mínimo 6 caracteres.')
        .isLength({ max: 200 })
        .withMessage('A cidade deve ter no máximo 200 caracteres.'),

    body('phone1')
        .isLength({ min: 9 })
        .withMessage('O número de telefone deve ter no mínimo 9 caracteres.')
        .isLength({ max: 20 })
        .withMessage('O número de telefone deve ter no maximo 20 caracteres.')
        .notEmpty()
        .withMessage('O número de telefone é obrigatório.'),
        
    body('email1')
    .isEmail()
    .withMessage('Digite um e-mail válido.')
    .notEmpty()
    .withMessage('O email é obrigatório.')
    .isLength({ min: 6 })
    .withMessage('O email deve ter no mínimo 6 caracteres.')
    .isLength({ max: 200 })
    .withMessage('O email deve ter no máximo 200 caracteres.'),

    body('user_id')
    .notEmpty()
    .withMessage('O utilizador é obrigatório.')
    .isInt({ min: 1 })
    .withMessage('O valor do utilizador é inválido.')
    ,

    update,
];