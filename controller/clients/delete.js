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
const removeFiles =  async(filenames) => {
    const folderPath = path.join('uploads/clients');

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
const clientDelete = async (req, res, next) => {
    const id = req.params.id;
    
    const select_id = `SELECT id,name, email1,phone1 from clients WHERE id=${id}`;
    const resu = await mysql.execute(select_id);

    if (resu == "") {
        return res.status(500).send({
            message: ` Este cliente não existe... `,
        });
    }
    try {
        const select_tasks = `SELECT photo FROM clients WHERE id=${id}`;
        const results = await mysql.execute(select_tasks);
        // Extract the filenames from the result
        const filenames = results.map((row) => row.photo);
    
        await removeFiles(filenames);
        const query = `DELETE FROM clients WHERE id=${id}`;
        const result = await mysql.execute(query);
        pusher.trigger("my-channel", "my-event", {
            client: resu[0]
        })
        res.status(201).send({
            message: "Cliente apagado com sucesso!",
        });

    } catch (error) {
        res.status(500).send({
            error: error,
        });
    }
   
}
module.exports = clientDelete;