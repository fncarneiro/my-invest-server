const chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../server'),
    faker = require('faker'),
    expect = require('chai').expect;

chai.use(chaiHttp);

let token;

const today = new Date();
const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
const periodToday = today.toISOString().substring(0,10);
const periodTomorrow = tomorrow.toISOString().substring(0,10);
const periodYesterday = yesterday.toISOString().substring(0,10);
    
let id_investment = undefined;
const tokenUser = {
    email: "myinvest@server.com",
    password: "password"
};

describe('Investments Route', function () {
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
    it('Check Inserting a investment with future period.', function (done) {
        chai
            .request(server)
            .post('/investments/')
            .set("Authorization", `Bearer ${token}`)
            .send({
                period: periodTomorrow
            })
            .end((err, res) => {
                expect(err).not.exist;
                expect(res.status).to.equal(400);
                expect(res.body).to.be.a('object');
                expect(res.body.errors[0]).to.have.property('msg', 'Period must be iqual or less today.');                
                done();
            })
    });
    
    it('Insert a investment.', function (done) {
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
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('msg', 'Investment created.');
                expect(res.body).to.have.property('investment');
                expect(res.body.investment).to.have.property('id_investment');
                expect(res.body.investment).to.have.property('period').to.eql(periodToday);
                done();
            })
    });
    it('Check inserting a investment with duplicated period.', function (done) {
        chai
            .request(server)
            .post('/investments/')
            .set("Authorization", `Bearer ${token}`)
            .send({
                period: periodToday
            })
            .end((err, res) => {
                expect(err).not.exist;
                expect(res.status).to.equal(409);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('msg', 'Period already exists.');  
                expect(res.body).to.have.property('period').to.eql(periodToday);              
                done();
            })
    });
    
    it('Get all investments.', function (done) {
        chai
            .request(server)
            .get('/investments')
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                expect(err).not.exist;
                expect(res.status).to.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('records').to.eql(1);
                expect(res.body).to.have.property('investments').to.have.lengthOf(1);
                expect(res.body.investments[0]).to.have.property('id_investment');
                expect(res.body.investments[0]).to.have.property('period'); 
                id_investment = res.body.investments[0].id_investment;
                done();
            })
    });
    it('Get one investment.', function (done) {
        chai
            .request(server)
            .get(`/investments/${id_investment}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                expect(err).not.exist;
                expect(res.status).to.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('records').to.eql(1);
                expect(res.body).to.have.property('investment');
                expect(res.body.investment).to.have.property('id_investment').to.eql(id_investment);
                expect(res.body.investment).to.have.property('period').to.eql(periodToday+'T03:00:00.000Z');                
                done();
            })
    });
    it('Update a investment.', function (done) {
        chai
            .request(server)
            .put(`/investments/${id_investment}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ period: periodYesterday })
            .end((err, res) => {
                expect(err).not.exist;
                expect(res.status).to.equal(202);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('msg', 'Investment updated.');
                expect(res.body).to.have.property('investment');
                expect(res.body.investment).to.have.property('id_investment');
                expect(res.body.investment).to.have.property('period').to.eql(periodYesterday);
                done();
            })
    });
    it('Delete a investment.', function (done) {
        chai
            .request(server)
            .delete(`/investments/${id_investment}`)
            .set("Authorization", `Bearer ${token}`)            
            .end((err, res) => {
                expect(err).not.exist;
                expect(res.status).to.equal(202);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('msg', 'Investment deleted.');
                expect(res.body.investment).to.have.property('id_investment').to.eql(id_investment);                 
                done();
            })
    });

});