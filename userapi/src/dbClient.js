const redis = require("redis");
const configure = require('./configure');

const config = configure();
const db = redis.createClient({
  host: process.env.REDIS_HOST || config.redis.host,
  port: process.env.REDIS_PORT || config.redis.port,
  password: process.env.REDIS_PASSWORD || config.redis.password,
  retry_strategy: () => {
    return new Error("Retry time exhausted");
  },
});

const sendPing = async () => {
  try {
    const pingResult = await new Promise((resolve, reject) => {
      db.ping((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
    console.log(`PING réussi. Réponse : ${pingResult}`);
    return pingResult;
  } catch (error) {
    console.error(`Erreur lors de l'envoi de PING : ${error.message}`);
    throw error;
  }
};

const pingInterval = setInterval(sendPing, 3 * 60 * 1000);

// Puisque le cache Redis se ferme après un intervalle de 10 minutes,
// au lieu d'utiliser db.quit(), on laisse simplement l'intervalle s'écouler.
process.on('SIGINT', function () {
  clearInterval(pingInterval);
  process.exit();
});

module.exports = { db, sendPing };