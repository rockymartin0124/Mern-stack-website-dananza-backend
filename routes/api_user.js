const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);
const User = require('../models').User;
var bcrypt = require('bcrypt-nodejs');

// Get User Info By JWT Token
router.get('/', passport.authenticate('jwt', { session: false}), function(req, res) {
  var auth_user = req.user;

  res.status(200).send({success: true, info: auth_user})
});

// Update User Info
router.put('/', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  var auth_user = req.user;
  if (token) {
    auth_user
      .update({
        email: req.body.email,
        f_name: req.body.firstName,
        l_name: req.body.lastName,
        business_name: req.body.businessName
      })
      .then((user) => res.status(201).send(user))
      .catch((error) => res.status(400).send({success: false, message: error }));
  } else {
    return res.status(403).send({success: false, message: 'Unauthorized.'});
  }
});

// Change Password
router.put('/change_pwd', passport.authenticate('jwt', { session: false}), function(req, res) {
    var auth_user = req.user;
    bcrypt.compare(req.body.currentpwd, auth_user.password, function (err, isMatch) {
        if (isMatch) {
          auth_user
            .update({
              password: req.body.newpwd
            })
            .then((user) => res.status(201).send({success:true}))
            .catch((error) => res.status(400).send({success: false, message: error }));
        }else{
          res.status(201).send({success:false});
        }
    });
});

// Change QA
router.put('/change_qa', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  var auth_user = req.user;

  // res.status(201).send({success: true, message: "Updated Successfully."});
  if (token) {
    auth_user
      .update({
        secure_question: req.body.secure_question,
        secure_answer: req.body.secure_answer
      })
      .then((user) => res.status(201).send({success: true, message: "Updated Successfully."}))
      .catch((error) => res.status(400).send({success: false, message: error }));
  } else {
    return res.status(403).send({success: false, message: 'Unauthorized.'});
  }
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
