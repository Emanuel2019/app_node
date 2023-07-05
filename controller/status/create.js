const mysql = require("../mysql");
const { body, validationResult } = require('express-validator');
const create=async(req, res, next) => {
    const currentDate = new Date();
   
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const query="INSERT INTO status (name,description,color,created_at,updated_at) VALUES (?,?,?,?,?)";
        const result=await mysql.execute(query, [
            req.body.name, req.body.description, req.body.color,currentDate,currentDate
        ]);
        res.status(201).send({
            message: "Estado registado com sucesso!",
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
  
        body('color')
        .notEmpty()
        .withMessage('A color é obrigatória.')
        .isLength({ min: 4 })
        .withMessage('A color deve ter no mínimo 4 caracteres')
        .isLength({ max: 7 })
        .withMessage('A color deve ter no máximo 7 caracteres'),
    create,
];
