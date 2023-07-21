const mysql = require("../mysql").pool;
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
const login = async (req, res) => {
    const {email,password}=req.body
console.log(email,password)
    if(req.body.email===''||req.body.password===''){
        return res.status(400).send({msg:"E-mail ou senha não devem estar vazios"})

    }
    mysql.getConnection((error, conn) => {
    conn.query("SELECT * FROM users WHERE email=?",email,(err,result)=>{
     
        if(err){
            return res.status(400).send({
                msg:err
            })
        }

        if(result.length<1){
            return res.status(401).send({
                msg:'E-mail ou password está incorreto'
            })
            }
          
           bcrypt.compare(password,result[0].password,(err,data)=>{
          
              if(err){
                  return res.status(401).send({
                    msg:"E-mail ou password está incorreto "
                })
            }
            
            if(data){
          
                const token=jwt.sign({
                    user_id:result[0].id,
                    username:result[0].name,
                    email:result[0].email,
                    role:result[0].role,
                    country:result[0].country,
                    phone:result[0].country,
                    photo:result[0].photo,
                    

                },
                process.env.SECRET_KEY,{
                    expiresIn:"2h"
                }
                )
                return res.status(200).send({
                    msg:"Autenticado",
                    token:token
                });
            }
            return res.status(401).send({
                msg:"Falha de Autenticação"
            });
       
           
          
          })

    })
})
}
module.exports = login;

 