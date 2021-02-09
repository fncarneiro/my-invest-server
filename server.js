const node_env = process.env.NODE_ENV.trim();
switch (node_env) {
    case 'production':
        require('dotenv').config({ path: './config/env/.env.production' });
    case 'test':
        require('dotenv').config({ path: './config/env/.env.test' });
        break;
    default:
        require('dotenv').config({ path: './config/env/.env.development' });
        break;
}
console.log('Enviroment: ', node_env.toUpperCase());

const customExpress = require('./config/customExpress');
const tables = require('./infrastructure/tables');

const port = process.env.PORT || 3000;

tables.createTables();

const app = customExpress;

app.listen(port, (error) => {
    if (error) {
        return console.log(`Fail on starting server - ${error}`)
    }
    else {
        console.log(`Server running on ${process.env.HOST} - port ${port} ...`)
    }
})

module.exports = app