const auth = require('../middlewares/auth');
const users = require('../controllers/users');

module.exports = app => {
    app.get('/users', auth.mandatory, users.listUsers);

    app.get('/users/:email', auth.mandatory, users.getUser);       

    app.put('/users', auth.mandatory, users.putUser);

    app.post('/users', auth.optional, users.postUser);

    app.delete('/users', auth.mandatory,users.deleteUser);    
}
