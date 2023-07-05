const { v4: uuidv4 } = require('uuid');
const mysql = require("../mysql");
const { body, validationResult } = require('express-validator');
const create = async (req, res, next) => {
    const reference = 'HT' + uuidv4().replace(/-/g, '');
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const query = "INSERT INTO clients (reference, name, address, country, city, phone1, phone2, email1, email2, Active, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const result = mysql.execute(query, [
            reference,
            req.body.name,
            req.body.address,
            req.body.country,
            req.body.city,
            req.body.phone1,
            req.body.phone2,
            req.body.email1,
            req.body.email2,
            req.body.Active,
            req.body.user_id,]);
        res.status(201).send({
            message: "Cliente registado com sucesso!",
            Id: result.insertId,
        });
      
    } catch (error) {
       
        res.status(500).send({
            error: error,
        });
    }

}
module.exports =[
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
