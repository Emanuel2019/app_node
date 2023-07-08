const mysql = require("../mysql");
const fileDelete=async(req, res, next) => {
    const id = req.params.id;
try {
   const query= "DELETE FROM files WHERE id = ?";
   const result=await mysql.execute(query,[id]);
   return res.status(200).send({
    message: "Ficheiro apagado com sucesso!",
    Id: result.insertId,
});
} catch (error) {
    return res.status(500).send({
        error: error,
    });
}
    
}
module.exports=fileDelete;