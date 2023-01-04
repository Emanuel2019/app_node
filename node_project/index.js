const express= require('express');
const database = require('./conection');
const app = express();
app.listen(5000,()=>{
    console.log('Server listening on port 5000')
})