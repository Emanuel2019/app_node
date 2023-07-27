const mysql = require("../mysql");
const moment = require('moment');
const { addDays, differenceInHours, format } = require('date-fns');
const getAll = async (req, res, next) => {
    try {
        const query = `SELECT tasks.id, tasks.name,tasks.description, tasks.created_at,tasks.updated_at,users.id AS user_id, users.name AS user_name,
    users.role AS roles,users.email AS user_email,users.country AS country_user,clients.id as client_id,
    clients.name AS client_name,types.id as type_id,types.name AS type_name,groups.id AS groups_id, groups.name AS group_name,
    areas.id as areas_id,areas.name AS area_name, status.id as status_id, status.name as status_name,channels.id As channel_id,
    channels.name AS channel_name
     FROM tasks
     JOIN users ON tasks.user_id = users.id
    JOIN clients ON tasks.client_id = clients.id
    JOIN types ON tasks.type_id = types.id
    JOIN  \`groups\` ON tasks.group_id = groups.id
    JOIN areas ON tasks.area_id = areas.id
    JOIN status ON tasks.status_id = status.id
    JOIN channels ON tasks.channel_id = channels.id;
`;

        const result = await mysql.execute(query);
        const tasks = result.map((task) => {
            //const threeDaysAfterCreation = addDays(new Date(task.created_at), 3);
            const dataCriacao = moment(new Date(task.created_at));
            //const threeDaysAfterCreation = '2023-07-27 12:00:00';

            // Converter a string para um objeto moment
            const creationDate = moment(dataCriacao, 'YYYY-MM-DD HH:mm:ss');
            
            // Data atual (moment)
            const currentDate = moment();
            
            // Calcular a diferença em horas
            let diffInHours = currentDate.diff(creationDate, 'hours');
            
            // Reduzir as horas a cada dia
            const daysPassed = currentDate.diff(creationDate, 'days');
            diffInHours -= daysPassed * 24;
            return {
                id: task.id,
                name: task.name,
                description: task.description,
                user: {
                    id: task.user_id,
                    name: task.user_name,
                    role: task.roles,
                    email: task.user_email,
                    country: task.country_user

                },
                clients: {
                    id: task.client_id,
                    name: task.client_name,

                },
                types: {
                    id: task.type_id,
                    name: task.type_name
                },
                groups: {
                    id: task.group_id,
                    name: task.group_name

                },
                areas: {
                    area_id: task.area_id,
                    name: task.area_name
                },
                status: {
                    id: task.status_id,
                    name: task.status_name
                },

                channels: {
                    id: task.channel_id,
                    name: task.channel_name
                },
                active: task.active,
                created_at: task.created_at,
                updated_at: task.updated_at,
               total:diffInHours
            };
        });
       
        return res.status(200).send({
            task: tasks,

        });
    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
}

module.exports = getAll;