const mysql= require('mysql');
var pool= mysql.createPool({
    "user": "root",//process.env.MYSQL_USER,
    "password":"", //process.env.MYSQL_PASSWORD,
    "host": "localhost",//process.env.MYSQL_HOST,
    "port":"3306", //process.env.MYSQL_PORT,
    "database": "helptask",//process.env.MYSQL_DATABASE,
}
);
 exports.pool= pool;