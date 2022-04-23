const chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../server'),
    faker = require('faker'),
    expect = require('chai').expect;

chai.use(chaiHttp);

let token;
const tokenUser = {
    email: "myinvest@server.com",
    password: "password"
};

const today = new Date();
const periodToday = today.toISOString().substring(0, 10);
let id_stock = undefined;
let defaultStock = {
    id_investment: undefined,
    stock_name: 'PETR4',
    by_amount: 100,
    by_price: 29.28,
    by_tax: 1.45,
    target_profit: 10,
    sell_profit: 5.5,
    sell_amount: 100,
    sell_tax: 2.32,
    note: 'note',
}

describe('Stocks Route', function () {
    before(done => {
        chai
            .request(server)
            .post("/login")
            .send(tokenUser)
            .end((err, res) => {
                token = res.body.token;
                expect(res).to.have.status(200);
                done();
            });        
    });
    before(done => {
        chai
            .request(server)
            .post('/investments/')
            .set("Authorization", `Bearer ${token}`)
            .send({
                period: periodToday
            })
            .end((err, res) => {
                expect(err).not.exist;
                expect(res.status).to.equal(201);
                defaultStock.id_investment = res.body.investment.id_investment;
                done();
            });
    })

    after(done => {
        chai
            .request(server)
            .delete(`/investments/${defaultStock.id_investment}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                expect(err).not.exist;
                expect(res.status).to.equal(202);
                done();
            })
    });

    it('Insert a Stock.', function (done) {
        chai
            .request(server)
            .post('/stocks/')
            .set("Authorization", `Bearer ${token}`)
            .send(defaultStock)
            .end((err, res) => {                
                expect(err).not.exist;
                expect(res.status).to.equal(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('msg', 'Stock created.');                
                expect(res.body.stock).to.have.property('id_stock').to.eql(res.body.stock.id_stock);
                done();
            })
    });

    it('Check inserting a Stock with not found investment.', function (done) {   
        let wrongStock = {...defaultStock};
        wrongStock.id_investment = 0;  
        chai
            .request(server)
            .post('/stocks/')
            .set("Authorization", `Bearer ${token}`)
            .send( wrongStock )
            .end((err, res) => {                
                expect(err).not.exist;
                expect(res.status).to.equal(409);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('msg', 'Investment not found.');                
                expect(res.body).to.have.property('id_investment').to.eql(res.body.id_investment);
                done(); 
            })
    });    

    it('Get all stocks.', function (done) {
        chai
            .request(server)
            .get('/stocks')
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                expect(err).not.exist;
                expect(res.status).to.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('records').to.eql(1);
                expect(res.body).to.have.property('stocks').to.have.lengthOf(1);
                expect(res.body.stocks[0]).to.have.property('id_stock');
                expect(res.body.stocks[0]).to.have.property('stock_name'); 
                id_stock = res.body.stocks[0].id_stock;
                done();
            })
    });

    it('Get one stock.', function (done) {
        chai
            .request(server)
            .get(`/stocks/${id_stock}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                expect(err).not.exist;
                expect(res.status).to.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('records').to.eql(1);
                expect(res.body).to.have.property('stock');
                expect(res.body.stock).to.have.property('id_stock').to.eql(id_stock);
                expect(res.body.stock).to.have.property('stock_name').to.eql(defaultStock.stock_name);                
                done();
            })
    });

    it('Update a stock.', function (done) {
        let otherStock = {...defaultStock};
        otherStock.stock_name = 'KNRI11';
        chai
            .request(server)
            .put(`/stocks/${id_stock}`)
            .set("Authorization", `Bearer ${token}`)
            .send( otherStock )
            .end((err, res) => {
                expect(err).not.exist;
                expect(res.status).to.equal(202);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('msg', 'Stock updated.');
                expect(res.body).to.have.property('stock');
                expect(res.body.stock).to.have.property('id_stock');
                expect(res.body.stock).to.have.property('stock_name').to.eql(otherStock.stock_name);
                done();
            })
    });

    it('Delete a stock.', function (done) {
        chai
            .request(server)
            .delete(`/stocks/${id_stock}`)
            .set("Authorization", `Bearer ${token}`)            
            .end((err, res) => {
                expect(err).not.exist;
                expect(res.status).to.equal(202);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('msg', 'Stock deleted.');
                expect(res.body.stock).to.have.property('id_stock').to.eql(id_stock);                 
                done(); 
            })
    });

});