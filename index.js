// const http = require('http');
// const app = require('./app.js');
// const port = process.env.PORT || 3000;
// const server = http.createServer(app);
// server.listen(port);

const port = process.env.PORT || 3000;
const customExpress = require('./config/customExpress');
const conection = require('./infrastructure/conection');
const tables = require('./infrastructure/tables');

conection.connect((erro) => {
    if (erro) {
        console.log('Error connecting DB my-invest on port 3306.')
    } else {
        const app = customExpress();
        tables.init(conection);

        app.get('/test', (req, res) => res.send(`<p>WebServer running on port <strong>${port}</strong> - ${new Date}</p>`));

        app.listen(port, (err) => {
            if (err) {
                return console.log(`Anything goes wrong on starting server - ${err}`)
            }
            else {
                console.log(`Server running on port ${port} ...`)
            }
        });
    }
})


