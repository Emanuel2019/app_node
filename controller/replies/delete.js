const mysql = require("../mysql");
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1636801",
    key: "44ff09de68fa52623d22",
    secret: "2c11e7f6d816dcf20694",
    cluster: "sa1",
    useTLS: true
});
const typeDelete=async(req, res, next) => {
    const id = req.params.id;
    const select_id = `SELECT replies.id, replies.user_id, users.name AS user_name, replies.task_id, tasks.name AS task_name, replies.message, replies.created_at, replies.updated_at
    FROM replies
    JOIN users ON replies.user_id = users.id
    JOIN tasks ON replies.task_id = tasks.id WHERE replies.id=${id}`;
    const resu = await mysql.execute(select_id);

    if (resu == "") {
        return res.status(500).send({
            message: ` Essa resposta não existe... `,
        });
    }
try {
   const query= "DELETE FROM replies WHERE id = ?";
   const result=await mysql.execute(query,[id]);
   pusher.trigger("my-channel", "my-event", {
    resposta: resu[0]
});
   return res.status(200).send({
    message: "Resposta excluída com sucesso!",
    resposta: resu[0],
});
} catch (error) {
    return res.status(500).send({
        error: error,
    });
}
    
}
module.exports=typeDelete;