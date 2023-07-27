const mysql = require("../mysql");
const getId = async (req, res, next) => {
    const id = req.params.id;
    try {
        const query = `SELECT * FROM channels WHERE id = ?`;
        const result = await mysql.execute(query, [id]);
        const channels = result.map((channel) => {
            return {
                id: channel.id,
                name: channel.name,
                description: channel.description,
                created_at: channel.created_at,
                updated_at: channel.updated_at,
            };
        }
        );
        return res.status(200).send({
            Channels: channels,
        });
    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }

}
module.exports = getId;