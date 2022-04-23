import mysql2 from 'mysql2';
import { env } from 'process';

async function connection(query, params) {

    const pool = mysql2.createPool({
        connectionLimit: env.MYSQL_LIMIT,
        connectTimeout: env.MYSQL_TIMEOUT,
        host: env.MYSQL_HOST,
        port: env.MYSQL_PORT,
        user: env.MYSQL_USER,
        password: env.MYSQL_PASSWORD,
        database: env.MYSQL_DATABASE,
    })

    if (process.env.NODE_ENV == 'development') {
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

    function execQuery(query, params = []) {
        return new Promise((resolve, reject) => {
            pool.getConnection((error, conn) => {
                if (error) {
                    console.log(`Error connecting DB my-invest on port ${env.MYSQL_PORT}.`)
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

    execQuery(query, params);
}

export default connection;
