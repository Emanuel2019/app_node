const express = require('express');
const route = express.Router();
const mysql = require("../mysql").pool;
// Lista todos os tarefaes
route.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(`SELECT tasks.id, tasks.name,tasks.description, tasks.created_at,tasks.updated_at,users.id AS user_id, users.name AS user_name,
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
        `, (error, result, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error,
                });
            }
            const tasks = result.map((task) => {
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
                        name:task.channel_name
                    },
                    active: task.active,
                    created_at: task.created_at,
                    updated_at: task.updated_at,
                };
            });
            return res.status(200).send({
                tasks: tasks,
            });
        }
        );
        //   res.status(200).send({ message: "Listei todos os users do sistema!" });
    }
    );
}
);
// Regista um novo tarefa
route.post('/', (req, res, next) => {
    const currentDate = new Date();

    mysql.getConnection((error, conn) => {
        if (error) {
            res.status(500).send({
                error: error,
            });
            return;
        }

        conn.query(
            "INSERT INTO tasks (name, description, user_id, client_id, type_id, group_id, area_id, status_id, channel_id, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                req.body.name,
                req.body.description,
                req.body.user_id,
                req.body.client_id,
                req.body.type_id,
                req.body.group_id,
                req.body.area_id,
                req.body.status_id,
                req.body.channel_id,
                req.body.active,
                currentDate,
                currentDate,
            ],
            (error, resultado, field) => {
                if (error) {
                    res.status(500).send({
                        error: error,
                    });
                } else {
                    res.status(201).send({
                        message: "Tarefa registada com sucesso!",
                        Id: resultado.insertId,
                    });
                }
                conn.release();
            }
        );
    });
});

// Lista um tarefa especifico
route.get('/:id', (req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(`SELECT tasks.id, tasks.name,tasks.description, tasks.created_at,tasks.updated_at,users.id AS user_id, users.name AS user_name,
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
        JOIN channels ON tasks.channel_id = channels.id where tasks.id=${id}`, (error, result, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error,
                });
            }
            const tasks = result.map((task) => {
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
                        name:task.channel_name
                    },
                    active: task.active,
                    created_at: task.created_at,
                    updated_at: task.updated_at,
                };
            });
            return res.status(200).send({
                tasks: tasks,
            });
        }
        );
        //   res.status(200).send({ message: "Listei todos os users do sistema!" });
    }
    );
}
);
// Atualiza um tarefa especifico
route.put('/:id', (req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(
            "UPDATE tasks SET name=?,user_id=?,client_id=?,type_id=?,group_id=?,area_id=?,status_id=?,channel_id=?,active=?,created_at=?,updated_at=? WHERE id=?",
            [req.body.name, req.body.user_id, req.body.client_id, req.body.type_id, req.body.group_id, req.body.area_id, req.body.status_id, req.body.channel_id, req.body.active, req.body.created_at, req.body.updated_at, id],
            (error, resultado, field) => {
                if (error) {
                    res.status(500).send({
                        error: error,
                    });
                } else {
                    res.status(201).send({
                        message: "Tarefa atualizada com sucesso!",
                        Id: resultado.insertId,
                    });
                }
                conn.release();
            }
        );
    }
    );
}
);
// Apaga um tarefa especifico
route.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(`DELETE FROM tasks WHERE id=${id}`, (error, result, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error,
                });
            }
            res.status(201).send({
                message: "Tarefa apagada com sucesso!",
            });
        }
        );
    }
    );
}
);
module.exports = route;
