const { expect } = require('chai')
const userController = require('../src/controllers/user')
const db = require('../src/dbClient')

describe('User', () => {
  
  beforeEach(() => {
    db.flushdb()
  })
  
  describe('Create', () => {

    it('create a new user', (done) => {
      const user = {
        username: 'piratehunter',
        firstname: 'zoro',
        lastname: 'roronoa'
      }
      userController.create(user, (err, result) => {
        expect(err).to.be.equal(null)
        expect(result).to.be.equal('OK')
        done()
      })
    })

    it('passing wrong user parameters', (done) => {
      const user = {
        firstname: 'nami',
        lastname: 'roronoa'
      }
      userController.create(user, (err, result) => {
        expect(err).to.not.be.equal(null)
        expect(result).to.be.equal(null)
        done()
      })
    })

    it('avoid creating an existing user', (done)=> {
      const user = {
        username: 'piratehunter',
        firstname: 'zoro',
        lastname: 'roronoa'
      }
      // Create a user
      userController.create(user, () => {
        // Create the same user again
        userController.create(user, (err, result) => {
          expect(err).to.not.be.equal(null)
          expect(result).to.be.equal(null)
          done()
        })
      })
    })
  })

  describe('Get', ()=> {

    it('get a user by username', (done) => {
      const user = {
        username: 'piratehunter',
        firstname: 'zoro',
        lastname: 'roronoa'
      }
      // Create a user
      userController.create(user, () => {
        // Get an existing user
        userController.get(user.username, (err, result) => {
          expect(err).to.be.equal(null)
          expect(result).to.be.deep.equal({
            username: 'piratehunter',
            firstname: 'zoro',
            lastname: 'roronoa'
          })
          done()
        })
      })
    })
  
    it('can not get a user when it does not exist', (done) => {
      userController.get('invalid', (err, result) => {
        expect(err).to.not.be.equal(null)
        expect(result).to.be.equal(null)
        done()
      })
    })
    
    it('should get all users', (done) => {
      userController.getAllUsers((err, users) => {
        expect(err).to.be.null;
        expect(users).to.be.an('array');
        done();
      });
    });

  })

  describe('deleteUser', () => {
    it('should delete a user', (done) => {
      const username = 'testuser';
      db.hmset(username, {
        username: 'testuser',
        firstname: 'zoro',
        lastname: 'roronoa'
      }, () => {
        userController.deleteUser(username, (err, result) => {
          expect(err).to.be.null;
          expect(result).to.equal('User deleted successfully');
          done();
        });
      });
    });

    it('should handle non-existent user deletion', (done) => {
      const username = 'nonexistentuser';
      userController.deleteUser(username, (err, result) => {
        expect(err).to.not.be.null;
        expect(result).to.be.null;
        done();
      });
    });
  });

  describe('update', () => {
    it('should update a user', (done) => {
      const username = 'testuser';
      const user = {
        username: 'testuser',
        firstname: 'zoro',
        lastname: 'roronoa'
      };
      db.hmset(username, user, () => {
        const updatedUser = {
          username: 'testuser',
          firstname: 'Jane',
          lastname: 'roronoa'
        };
        userController.update(username, updatedUser, (err, result) => {
          expect(err).to.be.null;
          expect(result).to.equal('OK');
          done();
        });
      });
    });

    it('should handle non-existent user update', (done) => {
      const username = 'nonexistentuser';
      const user = {
        username: 'nonexistentuser',
        firstname: 'zoro',
        lastname: 'roronoa'
      };
      userController.update(username, user, (err, result) => {
        expect(err).to.not.be.equal(null);
        expect(result).to.be.null;
        done();
      });
    });
  });
})
