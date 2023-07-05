
const mysql = require("../mysql");
const getAll=async(req, res, next) => {
    try {
        const query=`SELECT * FROM status`;
        const result=await mysql.execute(query);
        const status = result.map((status) => {
            return {
                id:status.id,
                name: status.name,
                description: status.description,
                color:status.color,
                created_at: status.created_at,
                updated_at: status.updated_at,
            };
        });
        return res.status(200).send({
            status: status,
        });

    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
    
}
module.exports=getAll;