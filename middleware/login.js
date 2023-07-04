const jwt=require('jsonwebtoken');

exports.obrigatorio=(req,res,next)=>{
    try {

        const token=req.header('Authorization').replace('Bearer ','')
        const decode=jwt.verify(token,process.env.SECRET_KEY);
        res.user=decode;
        next();
        
    } catch (error) {
        return res.status(401).send({message:'Utilizador não autorizado'})
    }
}
exports.opcional=(req,res,next)=>{
    try {

        const token=req.header('Authorization').replace('Bearer ','')
        const decode=jwt.verify(token,process.env.SECRET_KEY);
        res.user=decode;
        next();
        
    } catch (error) {
        next();
    }
}