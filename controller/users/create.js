const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const mysql = require('../mysql');
const WebSocket = require('ws');

const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1636801",
    key: "44ff09de68fa52623d22",
    secret: "2c11e7f6d816dcf20694",
    cluster: "sa1",
    useTLS: true
});
const create = async (req, res, next) => {
   
    const select_id = `SELECT email FROM users WHERE email=?`;
    const resu = await mysql.execute(select_id, req.body.email);
    let message;
    const user_email = resu.map((row) => row.email);
  
    if (user_email==req.body.email) {
        console.log(user_email);
        message = "Este email já esta atribuido ao utilizador...";
        return res.status(401).send({
        message : message
        });
      
    }
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
     
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const currentDate = new Date();
        let filename;
        if (req.file) {
            filename = req.file.filename

        } else {
            filename = "sem foto";
        }

        const query =
            'INSERT INTO users (name, email, password, role, country, phone,photo,created_at,updated_at) VALUES (?,?, ?, ?, ?, ?, ?,?,?)';
        const resultado = await mysql.execute(query, [
            req.body.name,
            req.body.email,
            hashedPassword,
            req.body.role,
            req.body.country,
            req.body.phone,
            filename,
            currentDate,
            currentDate
        ]);
        const id = resultado.insertId
        const name = req.body.name;
        const email = req.body.email;
        const role = req.body.role;
        const country = req.body.country;
        const phone = req.body.phone;
        const message = "Utilizador registado com sucesso!";
        const dataInsert = {
            id,
            name,
            email,
            role,
            country,
            phone,
            currentDate,
            filename,
            message
        };

        pusher.trigger("my-channel", "my-event", {
            users: dataInsert
        });
        res.status(201).send({
            message: message,
            users: dataInsert

        });
    } catch (error) {
        res.status(500).send({
            error: error,
         
            
        });
    }
};

module.exports = [
    body('name')
        .notEmpty()
        .withMessage('O nome é obrigatório.')
        .isLength({ min: 6 })
        .withMessage('O nome deve ter no mínimo 6 caracteres.')
        .isLength({ max: 200 })
        .withMessage('O nome deve ter no máximo 200 caracteres.'),

    body('email')
        .isEmail()
        .withMessage('Digite um e-mail válido.')
        .notEmpty()
        .withMessage('O email é obrigatório.')
        .isLength({ min: 6 })
        .withMessage('O email deve ter no mínimo 6 caracteres.')
        .isLength({ max: 200 })
        .withMessage('O email deve ter no máximo 200 caracteres.'),

    body('password')
        .notEmpty()
        .withMessage('O password é obrigatório.')
        .isLength({ min: 6 })
        .withMessage('A password deve ter no mínimo 6 caracteres.')
        .isLength({ max: 200 })
        .withMessage('A password deve ter no máximo 200 caracteres.'),

    body('country')
        .notEmpty()
        .withMessage('O país é obrigatório.')
        .isLength({ min: 6 })
        .withMessage('O país deve ter no mínimo 6 caracteres.')
        .isLength({ max: 200 })
        .withMessage('O país deve ter no máximo 200 caracteres.'),

    body('phone')
        .isLength({ min: 9 })
        .withMessage('O número de telefone deve ter no mínimo 9 caracteres.')
        .isLength({ max: 13 })
        .withMessage('O número de telefone deve ter no mínimo 9 caracteres.')
        .notEmpty()
        .withMessage('O número de telefone é obrigatório.'),

    create,
];
