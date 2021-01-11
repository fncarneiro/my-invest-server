const login = require('../controllers/login');

module.exports = app => {
    app.post('/login', login.postLogin );
}