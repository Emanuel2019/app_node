const mysql = require("../mysql").pool;
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
const login = async (req, res) => {
    const {email,password}=req.body

    if(req.body.email.trim()===''||req.body.password.trim()===''){
        return res.status(400).send({msg:"email or password must not be empty"})
    
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
                msg:'email or password is incorrect'
            })
            }
          
           //check password
           bcrypt.compare(password,result[0].password,(err,data)=>{
          
              if(err){
                  return res.status(401).send({
                    msg:"email or Password is incorrect "
                })
            }
            
            if(data){
          
                const token=jwt.sign({
                    user_id:result[0].id,
                    email:result[0].email
                },
                process.env.SECRET_KEY,{
                    expiresIn:"1h"
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
             const token=jwt.sign({id:result[0].id.toString()},process.env.SECRET_KEY)   
               return res.status(200).send({
                msg:"logged in successfully",
                user:result[0],
                token
             })
          
          })

    })
})
}
module.exports = login;

 