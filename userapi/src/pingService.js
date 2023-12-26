const ping = (db) => {
  return new Promise((resolve, reject) => {
    db.ping((err, response) => {
      if (err) {
        console.error(`Erreur lors de l'envoi de PING : ${err.message}`);
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
};

module.exports = ping;