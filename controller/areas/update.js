const { validate, isLength, isBoolean, isInt, isISO8601 } = require('validator');
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1636801",
    key: "44ff09de68fa52623d22",
    secret: "2c11e7f6d816dcf20694",
    cluster: "sa1",
    useTLS: true
});
const mysql = require("../mysql");
const update = async (req, res, next) => {
    const id = req.params.id;
    const { name, description, active, group_id } = req.body;
    const select_id = `SELECT id,name from areas WHERE id=${id}`;
    const resu = await mysql.execute(select_id);

    if (resu == "") {
        return res.status(500).send({
            message: ` Essa area não existe `,
        });
    }
    try {
        const query = 'UPDATE areas SET name = ?, description = ?, active = ?, group_id = ?, updated_at = NOW() WHERE id = ?';
        const result = await mysql.execute(query, [name, description, active, group_id, id]);
        dataUpdate={
            "name":name,
            "description":description,
            "Grupo":group_id,
            "active":active
        }
        pusher.trigger("my-channel", "my-event", {
            areas: dataUpdate
        });
        res.status(200).send({
            message: "Área actualizada com sucesso!",
            area: {
                id: id,
                nome: name,
                descrição: description,
                group_id: group_id

            }
        });

    } catch (error) {
        res.status(500).send({ error: error });
    }


}
module.exports = update;