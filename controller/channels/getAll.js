
const mysql = require("../mysql");
const getAll = async (req, res, next) => {
    try {
        const query = `SELECT * FROM channels`;
        const result = await mysql.execute(query);
        const channels = result.map((channel) => {
            return {
                id: channel.id,
                name: channel.name,
                description: channel.description,
                created_at: channel.created_at,
                updated_at: channel.updated_at,
            };
        });
        return res.status(200).send({
            canais: channels,
        });

    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }

}
module.exports = getAll;