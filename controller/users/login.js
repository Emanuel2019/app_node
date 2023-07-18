const mysql = require("../mysql").pool;
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
const login = async (req, res) => {
    const {email,password}=req.body
    if(req.body.email.trim()===''||req.body.password.trim()===''){
        return res.status(400).send({msg:"E-mail ou senha não devem estar vazios"})

    }
    mysql.getConnection((error, conn) => {
    conn.query("SELECT * FROM users WHERE email=?",email,(err,result)=>{
     
        if(err){
            return res.status(400).send({
                msg:err
            })
        }

        //check whether the user with that email exists or not
        if(result.length<1){
            return res.status(401).send({
                msg:'E-mail ou password está incorreto'
            })
            }
          
           //check password
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
             //generate token
           
          
          })

    })
})
}
module.exports = login;

 