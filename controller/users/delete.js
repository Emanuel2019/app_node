
const mysql = require("../mysql");
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1636801",
    key: "44ff09de68fa52623d22",
    secret: "2c11e7f6d816dcf20694",
    cluster: "sa1",
    useTLS: true
});
const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    const select_id = `SELECT id,name,email,role,country,phone FROM users WHERE id=${id}`;
    const resu = await mysql.execute(select_id);
    const message = "Utilizador excluido com sucesso!";

    if (resu == "") {
        return res.status(500).send({
            message: "Este utilizado já não existe...",
        });
    } else {
        try {
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
                id: id,
            });


        } catch (error) {
            return res.status(500).send({
                error: error,
            });
        }
    }


}
module.exports = deleteUser;