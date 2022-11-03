const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);
const msg = require('../config/msg');

const User = require('../models').User;

router.post('/signup', function(req, res) {
  if ((!req.body.email || !req.body.password) && req.body.type === undefined ) {
    res.status(400).send({message: msg.requireLoginInput})
  } else {
    User
      .find({
        where: {
          email: req.body.email
        }
      })
      .then((user) => {
        if (!user) {
          User
            .create({
              email: req.body.email,
              password: req.body.password,
              f_name: req.body.firstName,
              l_name: req.body.lastName,
              business_name: req.body.businessName
            })
            .then((user) => res.status(201).send(user))
            .catch((error) => {
              console.log(error);
              res.status(400).send(error);
            });
        }
        else{
            if( req.body.type == "google" || req.body.type == "facebook" )
              res.status(201).send(user)
            else
              res.status(400).send({success: false, message: msg.authEmailExists})
        }
      })
      .catch((error) => res.status(400).send({success: false, message: error }));    
  }
});

router.post('/signin', function(req, res) {
  User
      .find({
        where: {
          email: req.body.email
        }
      })
      .then((user) => {
        if (!user) {
          return res.status(401).send({
            message: msg.authUserNotFound,
          });
        }
        // social login( FB and Google+ )
        if( req.body.isSocial !== undefined && req.body.isSocial !== false )
        {
          var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {expiresIn: 86400 * 30});
            jwt.verify(token, 'nodeauthsecret', function(err, data){
              console.log(err, data);
            })
            return res.json({success: true, user_info:user, token: 'JWT ' + token});
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
          if(isMatch && !err) {
            var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {expiresIn: 86400 * 30});
            jwt.verify(token, 'nodeauthsecret', function(err, data){
              console.log(err, data);
            })
            res.json({success: true, user_info:user, token: 'JWT ' + token});
          } else {
            res.status(401).send({success: false, message: msg.authWrongPassword});
          }
        })
      })
      .catch((error) => res.status(400).send({success: false, message: error }));
});

module.exports = router;
