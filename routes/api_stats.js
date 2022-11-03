const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);

router.get('/', passport.authenticate('jwt', {session: false}), function(req, res) {
  	res.status(201).send({success: true, message: 'Router exists.'});
});

module.exports = router;