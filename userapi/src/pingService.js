const ping = async (db) => {
    try {
      const pingResult = await db.ping();
      console.log(`PING réussi. Réponse : ${pingResult}`);
      return pingResult;
    } catch (error) {
      console.error(`Erreur lors de l'envoi de PING : ${error.message}`);
      throw error;
    }
  };
  
  module.exports = ping;
  