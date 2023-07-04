const mysql = require("../mysql").pool;
mysql.getConnection(error,conn=>{
    if(error){return res.status(500).send({error:error})}
    const query=`SELECT *FROM users where email=?`;
    conn.query(query,req.body.email,(error,results,fields)=>{
        conn.release();
        if(error){return res.status(500).send({error:error})}
        if(results.length<1){
            return res.status(404).send({mensagem:'E-mail não encontrado'})
        }
    })
})