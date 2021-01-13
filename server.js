const port = process.env.API_PORT || 3000;
const customExpress = require('./config/customExpress');
const conection = require('./infrastructure/conection');
const tables = require('./infrastructure/tables');

conection.getConnection((error, conn) => {
    if (error) {
        console.log(`Error connecting DB my-invest on port ${process.env.MYSQL_PORT}.`) 
    } else {
        const app = customExpress();  
        
        tables.init(conn);
        conn.release;      

        app.listen(port, (error) => {
            if (error) {
                return console.log(`Anything goes wrong on starting server - ${error}`)
            }
            else {
                console.log(`Server running on port ${port} ...`)
            }
        });
    }
}) 

