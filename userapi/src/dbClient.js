var redis = require("redis");
const configure = require('./configure');
const pingService = require('./pingService');

const config = configure();
var db = redis.createClient({
  host: process.env.REDIS_HOST || config.redis.host,
  port: process.env.REDIS_PORT || config.redis.port,
  password: process.env.REDIS_PASSWORD || config.redis.password,
  retry_strategy: () => {
    return new Error("Retry time exhausted");
  }
});

const pingInterval = setInterval(() => pingService(db), 3 * 60 * 1000);

// Gérer l'arrêt de l'application
process.on('SIGINT', function() {
  clearInterval(pingInterval);
  db.quit();
});

module.exports = db;
