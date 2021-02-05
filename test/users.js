//process.env.NODE_ENV = 'test';

const users = require('../models/users');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

const defaultUser = {
    name: "my-invest@server.com",
    password: "password"
};

let token;

// parent block
describe("User", () => {
    beforeEach(done => {
        chai
            .request(server)
            .post("/users")
            .send(defaultUser)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
    beforeEach(done => {
        chai
            .request(server)
            .post("/login")
            .send(defaultUser)
            .end((err, res) => {
                token = res.body.token;
                res.should.have.status(200);
                done();
            });
    });
    afterEach(done => {
        // After each test we truncate the database
        Users.remove({}, err => {
            done();
        });
    });

    describe("/get users", () => {
        it("should fetch all users successfully", (done) => {
            chai
                .request(server)
                .get("/users")
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    res.should.have.status(200);
                    // res.body.should.be.a('array');
                    // res.body.length.should.be.eql(0);
                    res.body.should.be.a("object");
                    res.body.should.have.property("users");
                    done();
                });
        });
    });
});
