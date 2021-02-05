const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: process.env.MYSQL_LIMIT,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});
console.log(process.env.MYSQL_DATABASE)
if (process.env.NODE_ENV == 'test') {
    pool.on('connection', () => console.log('MySql pool => connection success'));
    pool.on('release', () => console.log('MySql pool => connection returned'));
}

process.on('SIGINT', () =>
    pool.end(err => {
        if (err) return console.log(err);
        console.log('MySql pool => connection closed');
        process.exit(0);
    })
);

exports.execQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((error, conn) => {
            if (error) {
                console.log(`Error connecting DB my-invest on port ${process.env.MYSQL_PORT}.`)
                reject(error)
            } else {
                conn.query(query, params, (error, result, fields) => {
                    conn.release()
                    if (error) {
                        reject(error)
                    } else {
                        resolve(result)
                    }
                })
            }
        })
    })
}