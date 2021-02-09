const chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../server'),
    faker = require('faker'),
    expect = require('chai').expect;

chai.use(chaiHttp);

const default_user = {
    email: 'myinvest@server.com',
    password: 'password'
} 

describe('Login Route', function () {
    it('Check login without parameter.', function (done) {
        chai
            .request(server)
            .post('/login')
            .send({})
            .end((err, res) => {
                const bodyMsgs = res.body.errors.map((obj) => obj.msg);
                const msgs = ['Email is required.',
                    'Invalid Email format (email@domain.com).',
                    'Password is required.',
                    'Password must have min 8 characters.'];

                expect(res.status).to.equal(400);
                expect(res.body).to.be.a('object');
                expect(res.body.errors).to.have.lengthOf(4);
                bodyMsgs.map((element, index) => {
                    expect(element).to.equal(`${msgs[index]}`);
                });
                done();
            })
    });
    it('Check login with wrong password.', function (done) {
        chai
            .request(server)
            .post('/login')
            .send({
                email: default_user.email,
                password: faker.internet.password(8)
            })
            .end((err, res) => {
                expect(res.status).to.equal(401);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('msg', 'Authentication failed.');
                done();
            })
    });
    it('Check success login.', function (done) {
        chai
            .request(server)
            .post('/login')
            .send( default_user )
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(err).not.exist;
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('msg', 'Authentication success.');
                expect(res.body).to.have.property('token');
                done();
            })
    });
});