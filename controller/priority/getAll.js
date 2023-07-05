
const mysql = require("../mysql");
const getAll=async(req, res, next) => {
    try {
        const query=`SELECT * FROM priority`;
        const result=await mysql.execute(query);
        const priorities = result.map((priority) => {
            return {
                id: priority.id,
                name: priority.name,
                duration: priority.duration,
                responseTime:priority.responseTime,
                active:priority.active,
                created_at: priority.created_at,
                updated_at: priority.updated_at,
            };
        });

        return res.status(200).send({
          priorities: priorities,
        });

    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
    
}
module.exports=getAll;