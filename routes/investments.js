const investments = require('../controllers/investments');
const auth = require('../middlewares/auth');

module.exports = app => {

    app.get('/investments', auth.mandatory, investments.listInvestments);

    app.get('/investments/:id', auth.mandatory, investments.getInvestment);

    app.put('/investments/:id', auth.mandatory, investments.putInvestment);

    app.post('/investments', auth.mandatory, investments.postInvestment);

    app.delete('/investments/:id', auth.mandatory, investments.deleteInvestment);

}