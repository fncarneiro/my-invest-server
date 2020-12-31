const port = process.env.PORT || 3000;
const customExpress = require('./config/customExpress');
const conection = require('./infrastructure/conection');
const tables = require('./infrastructure/tables');

conection.connect((error) => {
    if (error) {
        console.log('Error connecting DB my-invest on port 3306.')
    } else {
        const app = customExpress();
        tables.init(conection);

        app.get('/test', (req, res) => res.send(`WebServer running on port ${port} - ${new Date}`));

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


