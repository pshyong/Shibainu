const express = require('express');
const passport = require('passport');
const db = require('../config');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/'
  }),
  (req, res) => {
    // assign to current user global
    console.log('User has logged in!');
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.post('/register', (req, res) => {
  // verify if email is of proper format
  // find if user exists already
  // verify if passwords match
  console.log(req.body);
  if (req.body.password !== req.body.confirmation) {
    return res.redirect('/');
  }
  db.one(
    'INSERT INTO User_account(username, hashed_password) VALUES ($1, $2) RETURNING username;',
    [req.body.email, req.body.password]
  )
    .then(user => {
      console.log(user + ' has been registered!');
      res.redirect('/');
    })
    .catch(err => {
      // deal with this later
      console.log(err);
      res.redirect('/');
    });
});

module.exports = router;
