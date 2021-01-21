const dotenv = require('dotenv').config();
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