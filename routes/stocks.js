const auth = require('../middlewares/auth');
const stocks = require('../controllers/stocks');

module.exports = app => {
    app.get('/stocks', auth.optional, stocks.listStocks);

    app.get('/stocks/:id', auth.optional, stocks.getStock);

    app.put('/stocks/:id', auth.mandatory, stocks.putStock);

    app.post('/stocks', auth.mandatory, stocks.postStock);

    app.delete('/stocks/:id', auth.mandatory, stocks.deleteStock);
}
