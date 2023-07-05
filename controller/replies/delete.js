const mysql = require("../mysql");
const typeDelete=async(req, res, next) => {
    const id = req.params.id;
try {
   const query= "DELETE FROM replies WHERE id = ?";
   const result=await mysql.execute(query,[id]);
   return res.status(200).send({
    message: "Resposta excluída com sucesso!",
    id: id,
});
} catch (error) {
    return res.status(500).send({
        error: error,
    });
}
    
}
module.exports=typeDelete;