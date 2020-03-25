const db = require('../../config');

const { param, validationResult } = require('express-validator');

function sendJSON(statusCode, payload) {
  return JSON.stringify({ status_code: statusCode, payload: payload });
}

function sendError(statusCode, message, additionalInfo = {}) {
  return JSON.stringify({
    status_code: statusCode,
    error: { message: message, additional_information: additionalInfo }
  });
}

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
