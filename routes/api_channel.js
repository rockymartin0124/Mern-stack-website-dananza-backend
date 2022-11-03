'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);
const msg = require('../config/msg');

const Adza_Profile = require('../models').Adza_Profile;
const Buyer_Profile = require('../models').Buyer_Profile;
const Channel = require('../models').Channel;

// get All channels by current Adza
router.get('/', passport.authenticate('jwt', {session: false}), async function(req, res) {
	var auth_user = req.user;
	var adza = await Adza_Profile.getAdzaFromUserID( auth_user.id, function(err, profile ){
		if( !err )
			return profile;
		else
			return res.status(400).send( {success: false, message: err });
	} );

	Channel
		.findAll({ where: {AdzaProfileId: adza.id} } )
		.then(function( channels ){
			if( channels.length )
			{
				return res.status(201).send({success: true, channels:channels});
			}
			else
				return res.status(201).send({success: true, message: msg.noResult });
		})
		.catch((error) => res.status(500).send({success: false, message: error }))

});

// Add new Channel
router.post('/', passport.authenticate('jwt', {session: false}), async function(req, res) {
	var auth_user = req.user;
	var adza = await Adza_Profile.getAdzaFromUserID( auth_user.id, function(err, profile ){
		if( !err )
			return profile;
		else
			return res.status(400).send( {success: false, message: err });
	} );

	Channel
		.create({
			AdzaProfileId: adza.id,
			media_type: req.body.media_type,
			follows: req.body.follows,
			username: req.body.username,
			linked_channel: req.body.linked_channel,
			add_time: new Date(),
			active: true
		})
		.then(( channel ) => res.status(201).send({success: true, channel:channel}))
		.catch((error) => res.status(400).send( {success: false, message: error }));
});

// Delete Channel
router.delete('/:id', passport.authenticate('jwt', {session: false}), async function(req, res) {
	var ChannelId = req.params.id;
	var auth_user = req.user;

	var adza = await Adza_Profile.getAdzaFromUserID( auth_user.id, function(err, profile ){
		if( !err )
			return profile;
		else
			return res.status(400).send( {success: false, message: err });
	} );

	Channel
	    .destroy( { where: { id: ChannelId, AdzaProfileId: adza.id } } )
	    .then((channel) => {
	    	if( channel)
	    		res.status(200).send({success: true, message: msg.deletedSuccess})
	    	else
	    		res.status(403).send({success: false, message: msg.noOwner})
	    })
	    .catch((error) => { res.status(400).send({success: false, message: error }); });
});

module.exports = router;