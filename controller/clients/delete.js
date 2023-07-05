const mysql = require("../mysql");
const clientDelete = async (req, res, next) => {
    const id = req.params.id;

    try {
        const query = `DELETE FROM clients WHERE id=${id}`;
        const result = await mysql.execute(query);
        res.status(201).send({
            message: "Cliente apagado com sucesso!",
        });

    } catch (error) {
        res.status(500).send({
            error: error,
        });
    }
   
}
module.exports = clientDelete;