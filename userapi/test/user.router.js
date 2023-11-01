const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../src/index')
const db = require('../src/dbClient')
const userController = require('../src/controllers/user')

chai.use(chaiHttp)

describe('User REST API', () => {

  beforeEach(() => {
    // Clean DB before each test
    db.flushdb()
  })
  
  after(() => {
    app.close()
    db.quit()
  })

  
  describe('GET /', () => {
    it('should return the homepage', (done) => {
      chai.request(app)
        .get('/')
        .then((res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res).to.be.html;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });
  });


  describe('POST /user', () => {

    it('create a new user', (done) => {
      const user = {
        username: 'piratehunter',
        firstname: 'zoro',
        lastname: 'roronoa'
      }
      chai.request(app)
        .post('/user/add')
        .send(user)
        .then((res) => {
          chai.expect(res).to.redirect;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });
  
    it('pass wrong parameters', (done) => {
      const user = {
        firstname: 'zoro',
        lastname: 'roronoa'
      }
      chai.request(app)
        .post('/user/add')
        .send(user)
        .then((res) => {
          chai.expect(res).to.redirect;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });
  });

  describe('GET /user', () => {
    
    it('get an existing user', (done) => {
      const user = {
        username: 'piratehunter',
        firstname: 'zoro',
        lastname: 'roronoa'
      }
      // Create a user
      userController.create(user, () => {
        // Get the user
        chai.request(app)
          .get('/user/' + user.username)
          .then((res) => {
            chai.expect(res).to.have.status(200)
            chai.expect(res.body.status).to.equal('success')
            chai.expect(res).to.be.json
            done()
          })
          .catch((err) => {
             throw err
          })
      })
    })
    
    it('can not get a user when it does not exis', (done) => {
      chai.request(app)
        .get('/user/invalid')
        .then((res) => {
          chai.expect(res).to.have.status(400)
          chai.expect(res.body.status).to.equal('error')
          chai.expect(res).to.be.json
          done()
        })
        .catch((err) => {
           throw err
        })
    })

    it('should return the list of users', (done) => {
      chai.request(app)
        .get('/user')
        .then((res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res).to.be.html;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });
  })

  describe('GET /user/add', () => {
    it('should return the add user form', (done) => {
      chai.request(app)
        .get('/user/add')
        .then((res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res).to.be.html;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });
  });


  describe('GET /user/delete', () => {
    it('should return the delete user form', (done) => {
      chai.request(app)
        .get('/user/delete')
        .then((res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res).to.be.html;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });
  });

  describe('GET /user/update', () => {
    it('should return the update user form', (done) => {
      chai.request(app)
        .get('/user/update')
        .then((res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res).to.be.html;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });
  });

  describe('GET /user/:username', () => {
    it('should get an existing user', (done) => {
      const user = {
        username: 'piratehunter',
        firstname: 'zoro',
        lastname: 'roronoa'
      };
      // Create a user
      userController.create(user, () => {
        chai.request(app)
          .get(`/user/${user.username}`)
          .then((res) => {
            chai.expect(res).to.have.status(200);
            chai.expect(res.body.status).to.equal('success');
            chai.expect(res).to.be.json;
            done();
          })
          .catch((err) => {
            throw err;
          });
      });
    });

    it('should not get a user when it does not exist', (done) => {
      chai.request(app)
        .get('/user/invalid')
        .then((res) => {
          chai.expect(res).to.have.status(400);
          chai.expect(res.body.status).to.equal('error');
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });
  });
})
