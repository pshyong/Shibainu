const db = require('../../config');
const bcrypt = require('bcrypt');

const { body, param, validationResult } = require('express-validator');

function sendJSON(statusCode, payload) {
  return JSON.stringify({ status_code: statusCode, payload: payload });
}

function sendError(statusCode, message, additionalInfo = {}) {
  return JSON.stringify({
    status_code: statusCode,
    error: { message: message, additional_information: additionalInfo }
  });
}

exports.createUser = [
  body('name')
    .exists()
    .withMessage('Missing Name')
    .bail()
    .escape(),
  body('email')
    .exists()
    .withMessage('Missing Email')
    .bail()
    .escape(),
  body('password')
    .exists()
    .withMessage('Missing Password')
    .bail()
    .escape(),

  async function(req, res) {
    const { name, email, password, confirmation } = req.body;

    if (!email || !password || !confirmation || !name) {
      return res.status(404).send({ msg: 'Please enter all fields' });
    }

    if (password.length < 6) {
      return res
        .status(404)
        .send({ msg: 'Password must be at least 6 characters' });
    }

    if (password !== confirmation) {
      res.status(404).send({ msg: 'Passwords do not match' });
    }

    try {
      const user = await db.oneOrNone(
        'SELECT * FROM User_account WHERE name=$1;',
        [name]
      );

      if (user) {
        console.log(user);
        res.status(400).send({ msg: 'User already exists' });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err)
            return res
              .status(500)
              .send(sendError(500, `/api${req.url} : error ${err}`));
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err)
              return res
                .status(500)
                .send(sendError(500, `/api${req.url} : error ${err}`));
            db.oneOrNone(
              'INSERT INTO User_account(name, username, hashed_password)' +
                'VALUES ($1, $2, $3) RETURNING *;',
              [name, email, hash]
            )
              .then(user => {
                console.log(user);
                res.status(200).json(user);
              })
              .catch(error => {
                res
                  .status(500)
                  .send(sendError(500, `/api${req.url} : error ${error}`));
              });
          });
        });
      }
    } catch (error) {
      res.status(500).send(sendError(500, `/api${req.url} : error ${error}`));
    }
  }
];

exports.getUser = [
  param('user_account_id')
    .exists()
    .withMessage('Missing User Account ID Parameter')
    .bail(),

  async function(req, res) {
    const errors = validationResult(req);
    const userId = req.params.user_account_id;
    if (!errors) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    try {
      const user = await db.oneOrNone(
        'SELECT * FROM User_account WHERE user_account_id=$1;',
        [userId]
      );

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).send('User does not exist');
      }
    } catch (err) {
      res.status(500).send(sendError(500, `/api${req.url}error${err}`));
    }
  }
];

exports.updateUser = [];

exports.deteleUser = [
  param('user_account_id')
    .exists()
    .withMessage('Missing User Account ID Parameter')
    .bail(),

  async function(req, res) {
    const errors = validationResult(req);
    const userId = req.params.user_account_id;
    if (!errors) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    try {
      const result = await db.result(
        'DELETE FROM User_account WHERE user_account_id=$1 RETURNING *;',
        [userId]
      );

      if (result.rowCount) {
        res.status(200);
      } else {
        res.status(404).send('User does not exist');
      }
    } catch (err) {
      res.status(500).send(sendError(500, `/api${req.url}error${err}`));
    }
  }
];
