const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);

const Listing = require('../models').Listing;
const Adza_Profile = require('../models').Adza_Profile;
const Channel = require('../models').Channel;

// get all listing info
router.get('/', function(req, res) {
	var listing_id = req.params.id;
	Listing
	    .findAll({include:[
	    				{model:Channel,attributes:['username','follows','linked_channel']},
	    				{model:Adza_Profile,include:[
	    					{model:Channel, attributes:['media_type']}
	    				]}
	    			]})
	    .then((listing) => res.status(200).send(listing))
	    .catch((error) => res.status(500).send({success: false, message: error }));
});

module.exports = router;