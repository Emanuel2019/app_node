const { validate, isLength, isBoolean, isInt, isISO8601 } = require('validator');
const mysql = require("../mysql");
const update = async (req, res, next) => {
    const id = req.params.id;
    const { name, description, active, group_id } = req.body;
    try {
        const query = 'UPDATE areas SET name = ?, description = ?, active = ?, group_id = ?, updated_at = NOW() WHERE id = ?';
        const result = await mysql.execute(query, [name, description, active, group_id, id]);
        res.status(200).send({
            message: "Área actualizada com sucesso!",
            area: {
                id:id,
                nome:name,
                descrição:description,
                group_id:group_id
                
            }
        });

    } catch (error) {
        res.status(500).send({ error: error });
    }
   
}
module.exports = update;