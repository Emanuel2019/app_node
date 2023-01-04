const express = require('express');
var mysql = require('mysql');
const app = express();
const router = express.Router();

const path = __dirname + '/views/';
const port = 8080;

router.use(function (req,res,next) {
  console.log('/' + req.method);
  next();
});

router.get('/', function(req,res){
  res.sendFile(path + 'index.html');
});

router.get('/venda', function(req,res){
  res.sendFile(path + 'sharks.html');
});
router.get('/produto', function(req,res){
  res.sendFile(path + 'produto.html');
});
router.get('/cliente', function(req,res){
  res.sendFile(path + 'cliente.html');
});

router.get('/fornecedor', function(req,res){
  res.sendFile(path + 'fornecedor.html');
});
router.get('/contacto', function(req,res){
  res.sendFile(path + 'contacto.html');
});


const pool=mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database:'teste'
});
pool.connect(function(err){
  //if(err) throw err;
  console.log('Connection getId: ');
    })
app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
})