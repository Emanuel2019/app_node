
const mysql = require("../mysql");
const getAll=async(req, res, next) => {
    try {
        const query=`SELECT * FROM types`;
        const result=await mysql.execute(query);
        const types = result.map((type) => {
            return {
                id: type.id,
                name: type.name,
                description: type.description,
                created_at: type.created_at,
                updated_at: type.updated_at,
            };
        });
        return res.status(200).send({
            types: types,
        });

    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
    
}
module.exports=getAll;