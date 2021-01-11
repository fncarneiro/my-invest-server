const auth = require('../middlewares/auth');
const users = require('../controllers/users');

module.exports = app => {
    app.get('/users', auth.mandatory, users.listUsers);

    app.get('/users/:id', auth.mandatory, users.getUser);       

    app.put('/users/:id', auth.mandatory, users.putUser);

    app.post('/users', auth.mandatory, users.postUser);

    app.delete('/users/:id', auth.mandatory,users.deleteUser);    
}
