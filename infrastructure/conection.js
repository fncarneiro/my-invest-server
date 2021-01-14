const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit : process.env.MYSQL_LIMIT,
    host: process.env.MYSQL_HOST, 
    port: process.env.MYSQL_PORT,   
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

pool.on('release', () => console.log('MySql pool => connection returned')); 

process.on('SIGINT', () => 
    pool.end(err => {
        if(err) return console.log(err);
        console.log('MySql pool => connection closed');
        process.exit(0);
    })
); 

module.exports = pool;
