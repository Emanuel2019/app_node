
const mysql = require("../mysql");
const getAll=async(req, res, next) => {
    try {
        const query=`SELECT replies.id, replies.user_id, users.name AS user_name, replies.task_id, tasks.name AS task_name, replies.message, replies.created_at, replies.updated_at
        FROM replies
        JOIN users ON replies.user_id = users.id
        JOIN tasks ON replies.task_id = tasks.id;
        `;
        const result=await mysql.execute(query);
        const replies = result.map((replay) => {
            return {
                id: replay.id,
                user: {
                     id: replay.user_id,
                     name:replay.user_name

                     },
              tasks: { 
                id: replay.task_id,
                name:replay.task_name
            },
                message: replay.message,
                created_at: replay.created_at,
                updated_at: replay.updated_at,
            };
        });
        return res.status(200).send({
            replies: replies,
        });

    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
    
}
module.exports=getAll;