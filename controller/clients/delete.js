const mysql = require("../mysql");
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1636801",
    key: "44ff09de68fa52623d22",
    secret: "2c11e7f6d816dcf20694",
    cluster: "sa1",
    useTLS: true
});
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