const mysql = require("../mysql");
const tasksDelete=async(req, res, next) => {
    const id = req.params.id;
    try {
        const query=`DELETE FROM tasks WHERE id=${id}`;
        const result=await mysql.execute(query);
        res.status(201).send({
            message: "Tarefa apagada com sucesso!",
        });
    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
 
}
module.exports=tasksDelete;