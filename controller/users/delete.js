
const mysql = require("../mysql");
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
            return Promise.resolve(); // Ignore removal if the file doesn't exist
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
const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    const select_id = `SELECT id,name,email,role,country,phone FROM users WHERE id=${id}`;
    const resu = await mysql.execute(select_id);
    const message = "Utilizador excluido com sucesso!";

    if (resu == "") {
        return res.status(500).send({
            message: "Este utilizado já não existe...",
        });
    }
    try {
        const select_tasks = `SELECT photo FROM users WHERE id=${id}`;
        const results = await mysql.execute(select_tasks);

        const filenames = results.map((row) => row.photo);
        console.log(filenames);
        await removeFiles(filenames);
        const query = `DELETE FROM users WHERE id=${id}`;
        const result = await mysql.execute(query);


        const dataDel = {
            "users": resu,
            "msg_del": message,
        };
        pusher.trigger("my-channel", "my-event", {
            users: dataDel
        });
        return res.status(200).send({
            message: message,
            user:resu,
        });


    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
}

module.exports = deleteUser;