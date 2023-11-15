const { expect } = require('chai');

let db;

describe('Redis', () => {
  before((done) => {
    db = require('../src/dbClient');
    db.on('connect', () => {
      console.log('Connected to Redis');
      done();
    });
    db.on('error', (err) => {
      console.error('Error connecting to Redis: ', err);
      done(err);
    });
  });

  it('should connect to Redis', () => {
    expect(db).to.not.be.undefined;
  });
});
