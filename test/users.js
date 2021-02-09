const chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../server'),
    faker = require('faker'),
    expect = require('chai').expect;

chai.use(chaiHttp);

let token;
let user_email = faker.internet.email();
const tokenUser = { 
    email: "myinvest@server.com",
    password: "password",
    permission_level: 0
};

describe('Users Route', function () {

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
    it('Insert a user.', function (done) {
        chai
            .request(server)
            .post('/users/')
            .set("Authorization", `Bearer ${token}`)
            .send({
                email: user_email,
                password: faker.internet.password(8),
                permission_level: 0
            })
            .end((err, res) => {
                expect(err).not.exist;
                expect(res.status).to.equal(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('msg', 'User created.');
                expect(res.body).to.have.property('user');
                expect(res.body.user).to.have.property('id_user');               
                expect(res.body.user).to.have.property('email').to.eql(user_email);
                expect(res.body.user).to.have.property('permission_level').to.eql(0);
                done();
            })
    });
    it('Insert a duplicated user.', function (done) {
        chai
            .request(server)
            .post('/users/')
            .set("Authorization", `Bearer ${token}`)
            .send({
                email: 'myinvest@server.com',
                password: faker.internet.password(8),
                permission_level: 0 
            })
            .end((err, res) => {     
                expect(err).not.exist;           
                expect(res.status).to.equal(409);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('msg', 'Email already exists.'); 
                expect(res.body).to.have.property('email').to.eql('myinvest@server.com');                
                done();
            })
    });
    it('Get all users.', function (done) {
        chai
            .request(server)
            .get('/users')
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                expect(err).not.exist;
                expect(res.status).to.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('records').to.eql(2);
                expect(res.body).to.have.property('users').to.have.lengthOf(2);
                expect(res.body.users[1].user).to.have.property('id_user');
                expect(res.body.users[1].user).to.have.property('email');
                expect(res.body.users[1].user).to.have.property('permission_level');
                user_email = res.body.users[1].user.email;
                done();
            })
    });
    it('Get one user.', function (done) {
        chai
            .request(server)
            .get(`/users/${user_email}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                expect(err).not.exist;
                expect(res.status).to.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('records').to.eql(1);
                expect(res.body).to.have.property('user');
                expect(res.body.user).to.have.property('id_user');
                expect(res.body.user).to.have.property('email').to.eql(user_email);
                expect(res.body.user).to.have.property('permission_level').to.eql(0);
                done();
            })
    });
    it('Update a user password.', function (done) {
        chai
            .request(server)
            .put('/users/')
            .set("Authorization", `Bearer ${token}`)
            .send({
                email: user_email,
                password: faker.internet.password(8)                
            })
            .end((err, res) => {
                expect(err).not.exist;
                expect(res.status).to.equal(202);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('msg', 'User password updated.');
                expect(res.body).to.have.property('user');
                expect(res.body.user).to.have.property('id_user');
                expect(res.body.user).to.have.property('email').to.eql(user_email);                
                done();
            })
    });
    it('Delete a user.', function (done) {
        chai
            .request(server)
            .delete('/users/')
            .set("Authorization", `Bearer ${token}`)
            .send({
                email: user_email                              
            })
            .end((err, res) => {
                expect(err).not.exist;
                expect(res.status).to.equal(202);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('msg', 'User deleted.');
                expect(res.body).to.have.property('user');                
                expect(res.body.user).to.have.property('email').to.eql(user_email);                
                done();
            })
    });

});