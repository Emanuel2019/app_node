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
const tasksDelete = async (req, res, next) => {
    const id = req.params.id;
    const select_id = `SELECT *FROM tasks WHERE id=${id}`;
    const resu = await mysql.execute(select_id);
    if (resu == "") {
        return res.status(500).send({
            message: "Esta tarefa já não existe...",
        });
    }
    try {
       
        const select_tasks = `SELECT  filename FROM files WHERE task_id=${id}`;
        const resut_id = await mysql.execute(select_tasks);
        
        const delete_tasks = ` DELETE FROM files WHERE task_id=${id}`;
        await mysql.execute(delete_tasks);
        if (resut_id == "") {
            const query=`DELETE FROM tasks WHERE id=${id}`;
            const result=await mysql.execute(query);
        } else {
            const query=`DELETE FROM tasks WHERE id=${id}`;
            const result=await mysql.execute(query);
            const removeFiles = async () => {
                const filenames = resut_id.map((row) => row.filename);
                const folderPath = path.join('uploads/tasks');

                const filePromises = filenames.map((fname) => {
                    const filePath = path.join(folderPath, fname);
                    if (!fs.existsSync(filePath)) {
                        console.error('Arquivo não encontrado:', filePath);
                        return Promise.resolve(); // Ignora a remoção se o arquivo não existir
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

            removeFiles();
           
        }
        pusher.trigger("my-channel", "my-event", {
            tasks: resu
        })
        res.status(201).send({
            tasks: resu,
            message: "Tarefa apagada com sucesso!",
        });
    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
}
module.exports = tasksDelete;