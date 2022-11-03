const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);
const msg = require('../config/msg');

const Buyer_Profile = require('../models').Buyer_Profile;
const Cart = require('../models').Cart;
const Campaign = require('../models').Campaign;
const Campaign_Listing = require('../models').Campaign_Listing;
const Listing = require('../models').Listing;
const Channel = require('../models').Channel;

var temp = 0;
// Get All listings in Cart
router.post('/cartListings', passport.authenticate('jwt', {session: false}), async function(req, res) {
	var auth_user = req.user;
	var UserId = auth_user.id;
	var cur_cart_id = 0;
	temp = req.body.cartid ? req.body.cartid : temp;
	cur_cart_id = temp;

	var buyer = await Buyer_Profile.getBuyerFromUserID( auth_user.id, function(err, profile ){
		if( !err )
			return profile;
		else
			return res.status(400).send( {success: false, message: err });
	} );

	// get current Campaign
	var opened_campaign = await Campaign
		.findOne({ where:{ BuyerProfileId: buyer.id, CartId: cur_cart_id }})
		.then((campaign) => { if( campaign ) return campaign; else return null })
		.catch((error) => res.status(500).send({success: false, message: error }));

	// Get associated Listings
	var listings = await Campaign_Listing
		.findAll({
			where:{ CampaignId: opened_campaign.id },
			include:
			[{
				model: Listing,
				include: 
				[{
					model: Channel
				}]
			}]
		})
		.then(function( listings ) {
			if( listings.length )
			{
				return listings;
			}
			else
				return [];
		})
		.catch((error) => res.status(500).send({success: false, message: error }))
		console.log('listings = ', listings);
	return res.status(201).send({success: true, listings: listings })
});

// Clear current cart
router.delete('/', passport.authenticate('jwt', {session: false}), async function(req, res) {
	var auth_user = req.user;
	var UserId = auth_user.id;
	var cartid = req.body.cartid;

	var buyer = await Buyer_Profile.getBuyerFromUserID( auth_user.id, function(err, profile ){
		if( !err )
			return profile;
		else
			return res.status(400).send( {success: false, message: err });
	});

	// get current Campaign
	var opened_campaign = await Campaign
		.findOne({ where:{ BuyerProfileId: buyer.id, CartId: cartid }})
		.then((campaign) => { if( campaign ) return campaign; else return null })
		.catch((error) => res.status(500).send({success: false, message: error }));

	opened_campaign
		.update({campaign_status: 'completed'});

	var current_cart = await Cart
		.findOne({where:{CampaignId: opened_campaign.id}})
		.then((cart) => { if( cart ) return cart; else return null; })
		.catch((error) => res.status(500).send({success: false, message: error }));

	current_cart.destroy( { where: { id: current_cart.id} } )
	    .then((cart) => {
	    	if( cart)
	    		res.status(200).send({success: true, message: msg.deletedSuccess})
	    	else
	    		res.status(403).send({success: false, message: msg.noOwner})
	    })
});

// Add a New Listing to the Cart
router.post('/addListing', passport.authenticate('jwt', {session: false}), async function(req, res) {
	var auth_user = req.user;
	var UserId = auth_user.id;
	var newlisting = req.body.newlisting, 
		sellerid = req.body.sellerid,
		cartid = req.body.cartid;

		console.log('cureent cart id = ======', cartid);

	var buyer = await Buyer_Profile.getBuyerFromUserID( auth_user.id, function(err, profile ){
		if( !err )
			return profile;
		else
			return res.status(400).send( {success: false, message: err });
	} );

	// get current Campaign
	var opened_campaign = await Campaign
		.findOne({ where: { CartId: cartid }})
		.then((campaign) => { if( campaign ) return campaign; else return null })
		.catch((error) => res.status(500).send({success: false, message: error }));

		console.log('campagin opened = ', opened_campaign);

	// unregistered user
	if( !opened_campaign)
	{
		opened_campaign = await Campaign
			.create(
				{
					CartId: cartid,
					BuyerProfileId: buyer.id,
					created_at: new Date(),
					campaign_name: '',
					campaign_status: '',
					campaign_price: 0,
					OrderId: 0
				}
			)
			.then((campaign) => 
			{ 
				console.log('creating campagin');
				Cart
					.findOne({
						where: { id: cartid }
					})
					.then(function(cart) {
						cart.update({
							CampaignId: campaign.id
						})
					})
					
				return campaign; 
			})
			.catch((error) => res.status(500).send({success: false, message: error }))
	}

	Campaign_Listing
		.findOrCreate({ 
			where: { ListingId: newlisting, CampaignId: opened_campaign.id },
			defaults: {
				CampaignId: opened_campaign.id,
				ListingId: newlisting,
				add_time: new Date(),
				AdzaProfileId: sellerid,
				Counts: 1
			}
		})
		.spread(function(camp_list, created){
			if(!created) {
				var temp = camp_list.dataValues.Counts + 1;
				camp_list.update({
					Counts: temp
				})
			}
		})
		.then(res.status(201).send({success: true, message: msg.addedSuccess}))
		.catch((error) => res.status(500).send({success: false, message: msg.noCart}))
});

//Delete a Listing in Cart
router.post('/:id', passport.authenticate('jwt', {session: false}), async function(req, res) {
	var auth_user = req.user;
	var UserId = auth_user.id;
	var del_listing_id = req.params.id;
	var cartid = req.body.cartid;

	console.log('cur req body = ', req.body);

	var buyer = await Buyer_Profile.getBuyerFromUserID( auth_user.id, function(err, profile ){
		if( !err )
			return profile;
		else
			return res.status(400).send( {success: false, message: err });
	} );

	// get current Campaign
	var opened_campaign = await Campaign
		.findOne({ where:{ BuyerProfileId: buyer.id, CartId: cartid }})
		.then((campaign) => { if( campaign ) return campaign; else return null })
		.catch((error) => res.status(500).send({success: false, message: error }));

	if(opened_campaign)
	{
		Campaign_Listing
			.destroy( { where: { id: del_listing_id, CampaignId: opened_campaign.id } } )
			.then(res.status(201).send({ success: true, message: msg.deletedSuccess}))
			.catch((error) => res.status(500).send({success: false, message: error }));
	}
	else res.status(304).send({success: false, message: msg.noCampaign})
});

//Create New Cart
router.post('/', passport.authenticate('jwt', {session: false}), async function(req, res) {
	var auth_user = req.user;
	var UserId = auth_user.id;

	var buyer = await Buyer_Profile.getBuyerFromUserID( auth_user.id, function(err, profile ){
		if( !err )
			return profile;
		else
			return res.status(400).send( {success: false, message: err });
	} );

	Cart
		.create({
			BuyerProfileId: buyer.id,
			subtotal: 0,
			CampaignId: 0
		})
		.then((cart) => res.status(201).send(cart))
		.catch((error) => res.status(400).send({ success: false, message: msg.noCart }));
});


module.exports = router;