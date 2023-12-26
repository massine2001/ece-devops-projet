var redis = require("redis");
const configure = require('./configure');
const pingService = require('./pingService');

const config = configure();
const db = redis.createClient({
  host: process.env.REDIS_HOST || config.redis.host,
  port: process.env.REDIS_PORT || config.redis.port,
  password: process.env.REDIS_PASSWORD || config.redis.password,
  retry_strategy: () => {
    return new Error("Retry time exhausted");
  }
});

let pingInterval;
if (process.env.NODE_ENV === 'production') {
  pingInterval = setInterval(() => pingService(db), 3 * 60 * 1000); // Ping toutes les 3 minutes
}

process.on('SIGINT', function() {
  clearInterval(pingInterval);
  db.quit();
});

module.exports = db;