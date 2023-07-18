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
    const select_id = `SELECT * FROM priority WHERE  id=${id}`;
    const resu = await mysql.execute(select_id);

    if (resu == "") {
        return res.status(500).send({
            message: ` Essa prioridade não existe... `,
        });
    }
try {
   const query= "DELETE FROM priority WHERE id = ?";
   const result=await mysql.execute(query,[id]);
   pusher.trigger("my-channel", "my-event", {
    prioridade: resu[0]
});
   return res.status(200).send({
    message: "Prioridade excluída com sucesso!",
    id: id,
});
} catch (error) {
    return res.status(500).send({
        error: error,
    });
}
    
}
module.exports=typeDelete;