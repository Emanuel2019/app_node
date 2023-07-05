const mysql = require("../mysql");
const getAll = async (req, res, next) => {

    try {
        const query = `SELECT * FROM clients`;
        const result = await mysql.execute(query);
                    const clientss = result.map((clients) => {
                return {
                    id: clients.id,
                    reference : clients.reference,
                    name: clients.name,
                    address: clients.address,
                    country: clients.country,
                    city: clients.city,
                    phone1: clients.phone1,
                    phone2: clients.phone2,
                    email1: clients.email1,
                    email2: clients.email2,
                    Active: clients.Active,
                    user_id: clients.user_id,
                    created_at: clients.created_at,
                    updated_at: clients.updated_at,
                };
            });
            return res.status(200).send({
                clientss: clientss,
            });

    } catch (error) {
        res.status(500).send({
            error: error,
        });
    }

}
module.exports = getAll;