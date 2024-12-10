var express = require('express');
var router = express.Router();

var bookService = require('../services/books');
var userService = require('../services/users');
var authService = require('../services/auth');
var ratingService = require('../services/ratings');
var recommendationService = require('../services/recommendation');
const httpError = require('http-errors');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let query = req.query.q;

  try{
    if(query){
      let results = await bookService.selectBySearchTerm(query);
      res.render('index', { results: results });
    }else{
      let results = await bookService.selectBestRated();
      res.render('index', { results: results, user: req.session.user });
    }
  }catch(e){
    console.log(e);
    next(new httpError(500));
  }
});

router.get('/book/:isbn', async function(req, res, next) {
  try{
    Promise.all([
      recommendationService.getBookRecommendations(req.params['isbn']),
      bookService.selectByISBN(req.params['isbn'])
    ]).then( (values) => {
      res.render('book', { book: values[1], user: req.session.user, recommendations: values[0] });
    }).catch( (e) => {
      console.log(e);
      next(new httpError(404));
    });
  }catch(e){
    console.log(e);
    next(new httpError(500));
  }
});

router.post('/book/:isbn', authService.isAuthenticated, async function(req, res, next) {
  console.log(req.body.rating, req.params['isbn']);
  ratingService.createOrUpdateBookRating(req.session.user.id, req.params['isbn'], req.body.rating);
  res.redirect(req.url);
});

router.get('/login', async function(req, res, next) {
    res.render('login');
});

router.post('/login', async function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  req.session.regenerate(async function (err) {
    if (err) next(err);

    userService.getOrCreate(username, await authService.cryptCredentials(password))
      .then( async (user) => {
        if(user){
          let isValid = await authService.checkPassword(password, user.password);
          if(isValid === true){
            req.session.user = {id:user.id, username:user.username};
            req.session.save(function (err) {
              if (err) return next(err)
              res.redirect('/')
            });
          }else{
            res.render('login', {error:"Usuário ou senha incorretos"});
          }
        }else{
          res.render('login', {error:"Usuário ou senha incorretos"});
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

router.get('/logout', async function(req, res, next) {
  req.session.user = null
  req.session.save(function (err) {
    if (err) next(err)

    req.session.regenerate(function (err) {
      if (err) next(err)
      res.redirect('/')
    })
  });
});

module.exports = router;
