
const mysql = require("../mysql");
const getAll=async(req, res, next) => {
    try {
        const query=`SELECT * FROM \`groups\``;
        const result=await mysql.execute(query);
        const groups = result.map((group) => {
            return {
                id: group.id,
                name: group.name,
                description: group.description,
                user_id:group.user_id,
                created_at: group.created_at,
                updated_at: group.updated_at,
            };
        });
        return res.status(200).send({
            groups: groups,
        });

    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
    
}
module.exports=getAll;