const { v4: uuidv4 } = require('uuid');
const mysql = require("../mysql");
const { body, validationResult } = require('express-validator');
const upload = require('express-fileupload');
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
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const secondes = String(currentDate.getSeconds()).padStart(2, '0');
    const reference = `HT${day}${month}${hours}${minutes}${secondes}`;
    const { name,
        address,
        country,
        city,
        phone1,
        phone2,
        email1,
        email2,

        user_id } = req.body;
        const message= "Cliente registado com sucesso!";
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        if (req.files) {
            const hours = String(currentDate.getHours()).padStart(2, '0');
            const minutes = String(currentDate.getMinutes()).padStart(2, '0');
            const secondes = String(currentDate.getSeconds()).padStart(2, '0');
            var file = req.files.foto;
            var filename = file.name;
            filename = hours + minutes + secondes + "_" + filename;
            file.mv('uploads/clients/' + filename, function (err) {

                if (err) {
                    res.send(err)
                }
            })
        }
        const query = "INSERT INTO clients (reference, name, address, country, city, phone1, phone2, email1, email2,photo,  user_id) VALUES ( ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const result = mysql.execute(query, [
            reference,
            name,
            address,
            country,
            city,
            phone1,
            phone2,
            email1,
            email2,
            filename,
            user_id
            ,]);
        const dataInsert = {
            reference,
            name,
            address,
            country,
            city,
            phone1,
            phone2,
            email1,
            email2,
            filename,
            user_id,
            
        };
        pusher.trigger("my-channel", "my-event", {
            cliente: dataInsert
        });
        res.status(201).send({
            message:message,
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

    create,
];
