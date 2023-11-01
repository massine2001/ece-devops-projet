const db = require('../dbClient')

module.exports = {
  create: (user, callback) => {
    // Check parameters
    if(!user.username)
      return callback(new Error("Wrong user parameters"), null)
    // Create User schema
    const userObj = {
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
    }
    // Check if user already exists
    db.hgetall(user.username, function(err, res) {
      if (err) return callback(err, null)
      if (!res) {
        // Save to DB
        db.hmset(user.username, userObj, (err, res) => {
          if (err) return callback(err, null)
          callback(null, res) // Return callback
        })
      } else {
        callback(new Error("User already exists"), null)
      }
    })
  },
  get: (username, callback) => {
    if(!username)
      return callback(new Error("Username must be provided"), null)
    db.hgetall(username, function(err, res) {
      if (err) return callback(err, null)
      if (res)
        callback(null, res)
      else
        callback(new Error("User doesn't exists"), null)
    })
  },
  getAllUsers: (callback) => {
    db.keys('*', (err, keys) => {
        if (err) return callback(err, null);

        const multi = db.multi();
        keys.forEach((key) => {
            multi.hgetall(key);
        });

        multi.exec((err, replies) => {
            if (err) return callback(err, null);
            callback(null, replies);
        });
    });
  },
  deleteUser: (username, callback) => {
    if (!username) {
      return callback(new Error("Username must be provided"), null);
    }
    db.del(username, (err, res) => {
      if (err) return callback(err, null);
      if (res === 1) {
        callback(null, "User deleted successfully");
      } else {
        callback(new Error("User not found"), null);
      }
    });
  },
  update: (username, user, callback) => {
    if (!username) {
      return callback(new Error("Username must be provided"), null);
    }
    const userObj = {
      username: username,
      firstname: user.firstname,
      lastname: user.lastname,
    };
    db.hmset(username, userObj, (err, res) => {
      if (err) return callback(err, null);
      callback(null, res);
    });
  },
  userExists: (username, callback) => {
    if (!username) {
      return callback(new Error("Username must be provided"), null);
    }
    db.exists(username, (err, res) => {
      if (err) return callback(err, null);
      callback(null, res === 1);
    });
  },

  // Fonction pour incrémenter un compteur associé à un utilisateur
  incrementCounter: (username, counterName, callback) => {
    if (!username || !counterName) {
      return callback(new Error("Username and counter name must be provided"), null);
    }
    db.hincrby(username, counterName, 1, (err, res) => {
      if (err) return callback(err, null);
      callback(null, res);
    });
  },

  // Fonction pour ajouter un élément à une liste associée à un utilisateur
  addToList: (username, listName, item, callback) => {
    if (!username || !listName || !item) {
      return callback(new Error("Username, list name, and item must be provided"), null);
    }
    db.rpush(username + ":" + listName, item, (err, res) => {
      if (err) return callback(err, null);
      callback(null, res);
    });
  },

  // Fonction pour récupérer tous les éléments d'une liste associée à un utilisateur
  getList: (username, listName, callback) => {
    if (!username || !listName) {
      return callback(new Error("Username and list name must be provided"), null);
    }
    db.lrange(username + ":" + listName, 0, -1, (err, res) => {
      if (err) return callback(err, null);
      callback(null, res);
    });
  }


}
