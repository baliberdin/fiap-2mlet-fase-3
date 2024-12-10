const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    verifyToken: function (req, res, next){
        const token = req.headers['authorization'];
        if (!token) {
            return res.redirect("/login");
        }
        
        jwt.verify(token, 'secret', (err, decoded) => {
            if (err) {
              return res.redirect("/login");
            }
            req.user = decoded;
            next();
        });
    },

    signToken: function(username){
      const token = jwt.sign({ username: username }, 'secret');
    },

    cryptCredentials: function(target){
      return new Promise((resolve, reject) => {
        bcrypt.hash(target, 8, function(err, hash){
          if(err){
            reject(e);
          }else{
            resolve(hash);
          }
        });
      });
    },

    checkPassword: function(input, target){
      return new Promise((resolve, reject) => {
        bcrypt.compare(input, target).then((res) => {
          if(res === true)resolve(true);
          reject(false);
        });
      });
    },

    isAuthenticated: function (req, res, next) {
      if (req.session.user) next()
      else res.redirect("/login");
    }
}