'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);
const msg = require('../config/msg');

const Adza_Profile = require('../models').Adza_Profile;
const Buyer_Profile = require('../models').Buyer_Profile;
const Review = require('../models').Review;

// get reviews for Special Adza
router.get('/:AdzaProfileId', passport.authenticate('jwt', {session: false}), function(req, res) {
	var AdzaProfileId = req.params.AdzaProfileId;

	Review
		.findAll({where:{AdzaProfileId: AdzaProfileId}})
		.then(function( reviews ) {
			if( reviews.length )
				return res.status(201).send({success: true, reviews:reviews});
			else
				return res.status(201).send({success: true, message: msg.noResult });
		})
		.catch((error) => res.status(500).send({success: false, message: error }))
});

// post new review to Adza
router.post('/', passport.authenticate('jwt', {session: false}), async function(req, res) {
	var auth_user = req.user;
	var buyer = await Buyer_Profile.getBuyerFromUserID( auth_user.id, function(err, profile ){
		if( !err )
			return profile;
		else
			return res.status(400).send( {success: false, message: err });
	} );

	Review
		.create({
			AdzaProfileId: req.body.AdzaProfileId,
			BuyerProfileId: buyer.id,
			review_point: req.body.review_point,
			review_description: req.body.review_description,
			review_date: new Date()
		})
		.then(( review ) => res.status(201).send({success: true, review:review}))
		.catch((error) => res.status(400).send( {success: false, message: error }));
});

module.exports = router;