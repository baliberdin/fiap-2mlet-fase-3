const pool = require('./db').pool;

module.exports = {
  getOrCreate: function(username, password){
    return new Promise((resolve, reject) => {
      pool.promise().query(
        `INSERT IGNORE INTO users (username, password) VALUES(?,?)`,
        [username, password]
      ).then( () => {
        pool.promise().query(
          `SELECT id, username, password FROM users WHERE username = ? LIMIT 1`,
          [username]
        ).then((results) => {
          if(results[0].length > 0)resolve(results[0][0]);
          resolve(undefined);
        }).catch((e) => {
          reject(e);
        })
      }).catch((e) => {
        reject(e);
      });
    });
  }
}