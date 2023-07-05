
const mysql = require("../mysql");
const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    try {
        const query = `DELETE FROM users WHERE id=${id}`;
        const result = await mysql.execute(query);
        return res.status(200).send({
            message: "Utilizador excluido com sucesso!",
            id: id,
        });

    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
   
}
module.exports = deleteUser;