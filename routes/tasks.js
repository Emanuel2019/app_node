const express= require('express');
const route= express.Router();
const mysql = require("../mysql").pool;
// Lista todos os tarefaes
route.get('/',(req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(`SELECT * FROM tasks`, (error, result, field) => {
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
                    description: task.description ,
                    user_id : task.user_id ,
                    client_id : task.client_id ,
                    type_id : task.type_id ,
                    group_id : task.group_id ,
                    area_id : task.area_id ,
                    status : task.status ,
                    dueData : task.dueData ,
                    channel_id  : task.channel_id  ,
                    active : task.active ,
                    created_at : task.created_at ,
                    updated_at : task.updated_at ,
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
            "INSERT INTO tasks (name, description, user_id, client_id, agent_id, type_id, group_id, area_id, status_id, channel_id, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                req.body.name,
                req.body.description,
                req.body.user_id,
                req.body.client_id,
                req.body.agent_id,
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
route.get('/:id',(req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(`SELECT * FROM tasks WHERE id=${id}`, (error, result, field) => {
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
                    user_id : task.user_id ,
                    client_id : task.client_id ,
                    type_id : task.type_id ,
                    group_id : task.group_id ,
                    area_id : task.area_id ,
                    status : task.status ,
                    dueData : task.dueData ,
                    channel_id  : task.channel_id  ,
                    active : task.active ,
                    created_at : task.created_at ,
                    updated_at : task.updated_at ,
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
route.put('/:id',(req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(
            "UPDATE tasks SET name=?,user_id=?,client_id=?,type_id=?,group_id=?,area_id=?,status_id=?,channel_id=?,active=?,created_at=?,updated_at=? WHERE id=?",
            [req.body.name, req.body.user_id, req.body.client_id, req.body.type_id, req.body.group_id, req.body.area_id, req.body.status_id,req.body.channel_id, req.body.active, req.body.created_at, req.body.updated_at, id],
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
route.delete('/:id',(req, res, next) => {
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
