const chai = require('chai'), 
chaiHttp = require('chai-http'), 
server = require('../server'), 
faker = require('faker'), 
expect = require('chai').expect;

chai.use(chaiHttp); 

setTimeout(() => {  
}, 2000);

describe('Init', function () { 
  it('check app status', function (done) { 
    chai.request(server).get('/').end((err, res) => { 
      expect(err).to.not.exist; 
      expect(res.status).to.equal(200); 
      done(); 
    })
  }); 
});  