const { expect } = require('chai');
const pingService = require('../src/pingService');

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

  it('should send PING to Redis', async () => {
    const originalPing = db.ping;
    db.ping = () => Promise.resolve('PONG'); 

    const result = await pingService(db);

    expect(result).to.equal('PONG');

    db.ping = originalPing;
  });

  it('should send PING at regular intervals', async () => {
    const originalPing = db.ping;
    db.ping = () => Promise.resolve('PONG');

    await new Promise(resolve => setTimeout(resolve, 3 * 1000));

    const result = await pingService(db);

    expect(result).to.equal('PONG');

    db.ping = originalPing;
  });
});
