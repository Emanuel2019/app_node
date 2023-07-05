const mysql = require("../mysql");
const getId = async (req, res, next) => {
    const id = req.params.id;
    try {
        const query = `SELECT * FROM priority WHERE id=?`;
        const result = await mysql.execute(query, [id]);
        const priorities = result.map((priorities) => {
            return {
              id: priorities.id,
              name: priorities.name,
              duration: priorities.duration,
              responseTime:priorities.responseTime,
              active:priorities.active,
              created_at: priorities.created_at,
              updated_at: priorities.updated_at,
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
module.exports = getId;