const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);
const Blog = require('../models').Blog;

// Get All Blogs
router.get('/', function(req, res) {
  Blog
    .findAll({ where:{active:true}, order:[['post_time', 'DESC']]})
    .then((blogs) => res.status(200).send(blogs))
    .catch((error) => { res.status(400).send(error); });
});

// Get Blog info by ID
router.get('/:id', function(req, res) {
  var blog_id = req.params.id;
  Blog
    .findByPk( blog_id )
    .then((blog) => res.status(200).send(blog))
    .catch((error) => { res.status(400).send(error); });
});

// Create new Blog
router.post('/', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Blog
      .create({
        title: req.body.title,
        content: req.body.content,
        post_time: new Date(),
        featured_image: req.body.featured_image,
        active: true
      })
      .then((blog) => res.status(201).send(blog))
      .catch((error) => res.status(400).send({success: false, message: error }));
  } else {
    return res.status(403).send({success: false, message: 'Unauthorized.'});
  }
});

// Change Active status
router.put('/:id', function(req, res) {
  var token = getToken(req.headers);
  var blog_id = req.params.id;
  if (token) {
    Blog
      .findByPk( blog_id )
      .then(function(blog) {
        blog.update({active: req.body.active});
        res.status(201).send({success: true, message: 'Updated.'});
      })
      .catch((error) => res.status(400).send({success: false, message: error }));
  } else {
    return res.status(403).send({success: false, message: 'Unauthorized.'});
  }
});

// Delete Special Blog
router.delete('/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
  var blog_id = req.params.id;
  Blog
    .destroy( { where: { id: blog_id } } )
    .then((blog) => res.status(200).send( {success: true, message: 'Deleted.'} ))
    .catch((error) => { res.status(400).send(error); });
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
