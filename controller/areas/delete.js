
const mysql = require("../mysql");
const deleteAreas = async (req, res, next) => {
    const id = req.params.id;
    try {
        const query = 'DELETE FROM areas WHERE id = ?';
        const result = await mysql.execute(query, [id]);
        return res.status(200).send({
            message: "Area apagada com sucesso!",
            areas: id,
        });
    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }

}
module.exports = deleteAreas;