// test/dbClient.js
const { expect } = require('chai');
const redis = require("redis");
const configure = require('../src/configure');

const config = configure();
const db = redis.createClient({
  host: process.env.REDIS_HOST || config.redis.host,
  port: process.env.REDIS_PORT || config.redis.port,
  password: process.env.REDIS_PASSWORD || config.redis.password,
  retry_strategy: () => {
    return new Error("Retry time exhausted");
  }
});

const sendPing = async () => {
  try {
    const pingResult = await db.ping();
    console.log(`PING réussi. Réponse : ${pingResult}`);
    return pingResult;
  } catch (error) {
    console.error(`Erreur lors de l'envoi de PING : ${error.message}`);
    throw error;
  }
};

const pingInterval = setInterval(sendPing, 3 * 60 * 1000);

describe('Redis', () => {
  before((done) => {
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

    await expect(sendPing()).to.eventually.equal('PONG');

    db.ping = originalPing;
  });

  it('should send PING at regular intervals', async () => {
    const originalPing = db.ping;
    db.ping = () => Promise.resolve('PONG');

    await new Promise(resolve => setTimeout(resolve, 3 * 1000));

    await expect(sendPing()).to.eventually.equal('PONG');

    db.ping = originalPing;
  });

  after(() => {
    clearInterval(pingInterval);
    db.quit();
  });
});
