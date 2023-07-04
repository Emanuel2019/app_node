const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const mysql = require('../mysql');

const create = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const currentDate = new Date();
        const query =
            'INSERT INTO users (name, email, password, role, country, phone,created_at,updated_at) VALUES (?, ?, ?, ?, ?, ?,?,?)';
        const resultado = await mysql.execute(query, [
            req.body.name,
            req.body.email,
            hashedPassword,
            req.body.role,
            req.body.country,
            req.body.phone,
            currentDate,
            currentDate
        ]);

        res.status(201).send({
            message: 'Utilizador registado com sucesso!',
            Id: resultado.insertId,
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
