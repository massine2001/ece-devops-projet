var redis = require("redis");
const configure = require('./configure')

const config = configure()
var db = redis.createClient({
  host: process.env.REDIS_HOST || config.redis.host,
  port: process.env.REDIS_PORT || config.redis.port,
  password: process.env.REDIS_PASSWORD || config.redis.password, 
  retry_strategy: () => {
    return new Error("Retry time exhausted")
  }
})

process.on('SIGINT', function() {
  db.quit();
});

module.exports = db
