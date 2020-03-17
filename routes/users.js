const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../config');
const router = express.Router();

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
  })
);

router.get('/logout', (req, res) => {
  req.flash('success', 'You have logged out! See you again.');
  req.logout();
  res.redirect('/');
});

router.post('/register', (req, res, next) => {
  console.log(req.body);
  const { email, password, confirmation } = req.body;
  let errors = [];

  if (!email || !password || !confirmation) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  // find if user exists already
  if (password !== confirmation) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (errors.length > 0) {
    console.log('Rendering Errors');
    res.render('pages/index', {
      errors,
      email,
      password,
      confirmation,
      title: 'shibainu',
      name: req.params.name,
      category: req.params.cat_name
    });
  } else {
    db.oneOrNone('SELECT * FROM User_account WHERE username=$1;', [email])
      .then(user => {
        if (user) {
          req.flash('error', 'Email already exists');
          res.redirect('/');
        } else {
          bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err);
            bcrypt.hash(req.body.password, salt, function(err, hash) {
              if (err) return next(err);

              // Store the user to the database, then send the response
              db.none(
                'INSERT INTO User_account(username, hashed_password)' +
                  'VALUES ($1, $2);',
                [email, hash]
              )
                .then(() => {
                  req.flash('success', 'Successfully created a new account!');
                  res.redirect('/');
                })
                .catch(error => {
                  req.flash('error', error.message);
                  res.redirect('/');
                });
            });
          });
        }
      })
      .catch(error => {
        req.flash('error', error.message);
        res.redirect('/');
      });
  }
});

module.exports = router;
