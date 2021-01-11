const express = require('express');
const port = process.env.API_PORT || 3000;
const bodyParser = require('body-parser');
const consign = require('consign');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

module.exports = () => {
    const app = express();

    app.use(cors());
    app.use(helmet());
    app.use(compression());

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(morgan('dev'));

    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
            return res.status(200).send({
                Options: 'GET, PUT, POST, DELETE'
            });
        }
        next();
    });

    // consign({
    //     cwd: 'app',
    //     verbose: process.env.APP_DEBUG === 'true' || false,
    //     locale: 'pt-br'
    // }).include('./middlewares/globals').then('../routes').into(app)

    consign()
        .include('routes')
        .into(app);

    app.get('/test', (req, res) => res.send(`WebServer running on port ${port} - ${new Date}`));

    app.use((req, res, next) => {
        const error = new Error('Route not found.');
        error.status = 404;
        next(error);
    });

    app.use((error, req, res, next) => {
        res.status(error.status || 500);
        return res.send({
            error: error.message
        });
    });

    return app;
}
