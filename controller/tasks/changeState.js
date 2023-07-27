const mysql = require("../mysql");
const changeState = async (req, res, next) => {
    const task_id = req.params.task_id;
    const status_id = req.params.status_id;
    const currentDate = new Date();
    const select_id = `SELECT *FROM tasks WHERE id=${task_id}`;
    const resu = await mysql.execute(select_id);

    if (resu == "") {
        return res.status(500).send({
            message: ` Este tarefa não existe... `,
        });
    }
    if (task_id && status_id) {
        try {
            switch (status_id) {
                case 1:
                    const query1 = "UPDATE tasks SET status_id=?, created_at=? where id=? ";
                    const result1 = await mysql.execute(query1, [status_id,currentDate, task_id]);
                    break;
                case 2:
                    const query2 = "UPDATE tasks SET status_id=? where id=? ";
                    const result2 = await mysql.execute(query, [status_id, task_id]);
                    break;
                case 3:
                    const query3 = "UPDATE tasks SET status_id=? where id=? ";
                    const result3 = await mysql.execute(query3, [status_id, task_id]);
                    break;
                case 4:
                    const query4 = "UPDATE tasks SET status_id=? where id=? ";
                    const result4 = await mysql.execute(query4, [status_id, task_id]);
                    break;
                default:
                    const query = "ccbnfvcvbb tasks SET status_id=? where id=? ";
                    const result = await mysql.execute(query, [status_id, task_id]);

            }
            res.status(200).send({

                message: "Estado alterado com sucess",

            })
        } catch (error) {
            res.status(500).send({
                error: error,
            });
        }
    }
};
module.exports = changeState;