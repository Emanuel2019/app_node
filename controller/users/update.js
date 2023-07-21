const mysql = require("../mysql");
const bcrypt = require('bcrypt');
const Pusher = require("pusher");
const fs = require('fs');
const path = require('path');
const pusher = new Pusher({
    appId: "1636801",
    key: "44ff09de68fa52623d22",
    secret: "2c11e7f6d816dcf20694",
    cluster: "sa1",
    useTLS: true
});
const removeFiles = async (filenames) => {
    const folderPath = path.join('uploads/users');

    const filePromises = filenames.map((fname) => {
        const filePath = path.join(folderPath, fname);

        if (!fs.existsSync(filePath)) {
            console.error('Arquivo não encontrado:', filePath);
            return Promise.resolve(); 
        }

        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Erro ao remover o arquivo:', err);
                    reject(err);
                } else {
                    console.log(`Arquivo removido: ${filePath}`);
                    resolve();
                }
            });
        });
    });

    try {
        await Promise.all(filePromises);
        console.log('Todos os arquivos foram removidos com sucesso.');
    } catch (err) {
        console.error('Erro ao remover arquivos:', err);
    }
};
const { body, validationResult } = require('express-validator');
const update = async (req, res, next) => {
    const id = req.params.id;
    const currentDate = new Date();
    let filename = "";
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const select_id = `SELECT id,name,email,role,country,phone FROM users WHERE id=${id}`;
    const resu = await mysql.execute(select_id);
    if (resu == "") {
        return res.status(500).send({
            message: "Este utilizado já não existe...",
        });
    } else {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(error => error.msg);
                return res.status(400).json({ errors: errorMessages });
            }
            if (req.file) {
                filename = req.file.filename;
                const select_tasks = `SELECT photo FROM users WHERE id=${id}`;
                const results = await mysql.execute(select_tasks);

                const filenames = results.map((row) => row.photo);
                console.log(filenames);
                await removeFiles(filenames);

            } else {
                filename = "sem foto";
            }


            const query =
                "UPDATE users SET name=?,email=?,password=?,role=?,country=?,photo=?,phone=?,active=?,updated_at=? WHERE id=?";
            const resultado = await mysql.execute(query, [
                req.body.name,
                req.body.email,
                hashedPassword,
                req.body.role,
                req.body.country,
                filename,
                req.body.phone,
                req.body.active,
                currentDate,
                id
            ]);

            const name = req.body.name;
            const email = req.body.email;
            const role = req.body.role;
            const country = req.body.country;
            const phone = req.body.phone;
            const message = "Utilizador registado com sucesso!";
            const dataUpdate = {
                id,
                name,
                email,
                role,
                country,
                phone,
                filename,
                currentDate,
                message
            };

            res.status(201).send({
                message: "Utilizador actualizado com sucesso!",
                user: {
                    Id: id,
                    nome: req.body.name,
                    email: req.body.email,
                    role: req.body.role,
                    pais: req.body.country,
                    Telefone: req.body.phone,
                }
            });
            pusher.trigger("my-channel", "my-event", {
                users: dataUpdate
            });

        } catch (error) {
            res.status(500).send({
                error: error,
            });
        }
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

    update,
];
