'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);
const msg = require('../config/msg');
const Sequelize = require('sequelize');

const Adza_Profile = require('../models').Adza_Profile;
const Buyer_Profile = require('../models').Buyer_Profile;
const Message = require('../models').Message;
const Message_Contact = require('../models').Message_Contact;
const User = require('../models').User;

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8989 });

const sendMessage = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.UserId == data.readerId) {
      client.send(JSON.stringify(data))
    }
  })
};

wss.on('connection', (ws) => {
  let index;
  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    switch (data.type) {
	    case 'ADD_USER':
	        ws.UserId = data.UserId;
	        console.log("SOCKET CREATE:", data);
	        break;
	    case 'ADD_MESSAGE':
	        //store database start
	        let readerUserId,adzaId,buyerId;
        	var UserId = ws.UserId;
        	console.log("ADD_MESSAGE:",data);
        	console.log("ADD_MESSAGE:",UserId);
        	
	        if (data.s_type == "buyer") {
	        	var buyer = await Buyer_Profile.getBuyerFromUserID( UserId, function(err, profile ){
					if( !err )
						return profile;
					else
						return res.status(400).send( {success: false, message: err });
				} );
				var adza = await Adza_Profile.getAdzaFromUserID( data.readerId, function(err, profile ){
					if( !err )
						return profile;
					else
						return res.status(400).send( {success: false, message: err });
				} );
				buyerId = buyer.id;
				adzaId = adza.id;
	        }
	        else if (data.s_type == "seller") {
    			var buyer = await Buyer_Profile.getBuyerFromUserID( data.readerId, function(err, profile ){
					if( !err )
						return profile;
					else
						return res.status(400).send( {success: false, message: err });
				} );
				var adza = await Adza_Profile.getAdzaFromUserID( UserId, function(err, profile ){
					if( !err )
						return profile;
					else
						return res.status(400).send( {success: false, message: err });
				} );
				buyerId = buyer.id;
				adzaId = adza.id;
	        }
	        let contact = await Message_Contact.findOne({ where: { BuyerProfileId: buyerId, AdzaProfileId: adzaId } });

	        if (!contact) {
	        	break;
	        }
	        var message_time = new Date();
			Message
				.create({
			        BuyerProfileId: buyerId,
			        AdzaProfileId: adzaId,
			        MessageContactId:contact.id,
			        message_text: data.message,
			        message_time,
			        s_type: data.s_type,
			        is_new: true
			    })
			    .then((blog) => console.log("create msg log success") )
			    .catch((error) => console.log("create msg log failed"));
	        //store database end
	        sendMessage({
	          type: 'ADD_MESSAGE',
	          message_text: data.message,
	          authorId: UserId,
	          readerId: data.readerId,
	          BuyerProfileId: buyerId,
	          AdzaProfileId: adzaId,
	          MessageContactId:contact.id,
	          message_time,
	          s_type: data.s_type
	        });
	        ws.send(JSON.stringify({
	          type: 'SUCCESS_ADD_MESSAGE',
	          message_text: data.message,
	          authorId: UserId,
	          readerId: data.readerId,
	          BuyerProfileId: buyerId,
	          AdzaProfileId: adzaId,
	          MessageContactId:contact.id,
	          message_time,
	          s_type: data.s_type
	        }));
	        break;
	    default:
	        break;
    }
  });

  ws.on('close', () => {
	console.log("SOCKET CLOSE:", ws.UserId);
  });
})

//get one's contact
router.post('/contact', passport.authenticate('jwt', {session: false}), async function(req, res) {
	var auth_user = req.user;
  	var user_id = auth_user.id;
  	var user_type = req.body.s_type;
  	var arrRes = [];
  	var contacts = [];

	// Get Contact List with last message
  	if( user_type == 'buyer' )
  	{
		var buyer = await Buyer_Profile.getBuyerFromUserID( auth_user.id, function(err, profile ){
			if( !err )
				return profile;
			else
				return res.status(400).send( {success: false, message: err });
		} );

		Message_Contact
			.findAll({ where: { BuyerProfileId: buyer.id },
						include: [
							{
								model:Adza_Profile,
								include: [{
									model: User
								}]
							},
							{
								model:Buyer_Profile,
								include: [{
									model: User
								}]
							},
							{
								model:Message
							}
						] })
			.then((contacts)=>{
				if( Array.isArray(contacts) )
					res.status(201).send({success: true, result: contacts});
				else
					res.status(304).send({success: false, message: msg.noResult });

			})
			.catch((error) => res.status(400).send({success: false, message: error}))
	}
	else if( user_type == 'seller' )
	{
		var adza = await Adza_Profile.getAdzaFromUserID( auth_user.id, function(err, profile ){
			if( !err )
				return profile;
			else
				return res.status(400).send( {success: false, message: err });
		} );

		Message_Contact
			.findAll({ where: { AdzaProfileId: adza.id },
						include: [
							{
								model:Adza_Profile,
								include: [{
									model: User
								}]
							},
							{
								model:Buyer_Profile,
								include: [{
									model: User
								}]
							},
							{
								model:Message
							}
						] })
			.then((contacts)=>{
				if( Array.isArray(contacts) )
					res.status(201).send({success: true, result: contacts});
				else
					res.status(304).send({success: false, message: msg.noResult });
			})
			.catch((error) => res.status(400).send({success: false, message: msg.noResult}))
	}
});

//send message
router.post('/send', passport.authenticate('jwt', {session: false}), async function(req, res) {
	var auth_user = req.user;
  	var user_id = auth_user.id;
  	var user_type = req.body.s_type;
  	var adzaId = req.body.adzaId
  	var arrRes = [];
  	var messages = [];

  	// Get Contact List with last message
  	if( user_type == 'buyer' )
  	{
		var buyer = await Buyer_Profile.getBuyerFromUserID( auth_user.id, function(err, profile ){
			if( !err )
				return profile;
			else
				return res.status(400).send( {success: false, message: err });
		} );

		contact = await Message_Contact
			.findOne({ 
				where: { BuyerProfileId: buyer.id, AdzaProfileId: adzaId },
			})
			.then(function(contact)
			{
				if(contact)
				{
					return contact
				}
				else
					return res.status(304).send({success: false, message: msg.noResult });
			})
			.catch((error) => res.status(400).send({success: false, error: error }))
	}
	else
	{
		var adza = await Adza_Profile.getAdzaFromUserID( auth_user.id, function(err, profile ){
			if( !err )
				return profile;
			else
				return res.status(400).send( {success: false, message: err });
		} );

		contact = await Message_Contact.findOne({ where: { AdzaProfileId: adza.id } })
	}

	Message
		.findAll({
			where: { MessageContactId: contact.id }
		})
		.then((messages) => res.status(201).send({success: true, messages: messages}))
		.catch((error) => res.status(400).send({success: false, message: msg.noResult}))
});

//get message
router.post('/fetch', passport.authenticate('jwt', {session: false}), async function(req, res) {
	var auth_user = req.user;
  	var user_id = auth_user.id;
  	var s_type = req.body.s_type;
  	var oppositeId = req.body.UserId;
  	var sendMsgs = [];
  	var recieveMsgs = [];

  	// Get Contact List with last message
	var AdzaProfileId;
	var BuyerProfileId;

	if (s_type == "buyer") {
		var adza = await Adza_Profile.getAdzaFromUserID( oppositeId, function(err, profile ){
			if( !err )
				return profile;
			else
				return res.status(400).send( {success: false, message: err });
		} );
		AdzaProfileId = adza.id;
		var buyer = await Buyer_Profile.getBuyerFromUserID( user_id, function(err, profile ){
			if( !err )
				return profile;
			else
				return res.status(400).send( {success: false, message: err });
		} );
		BuyerProfileId = buyer.id;
	}
	else if (s_type == "seller") {
		var adza = await Adza_Profile.getAdzaFromUserID( user_id, function(err, profile ){
			if( !err )
				return profile;
			else
				return res.status(400).send( {success: false, message: err });
		} );
		AdzaProfileId = adza.id;
		var buyer = await Buyer_Profile.getBuyerFromUserID( oppositeId, function(err, profile ){
			if( !err )
				return profile;
			else
				return res.status(400).send( {success: false, message: err });
		} );
		BuyerProfileId = buyer.id;
	}

	Message
		.findAll({
			where: { BuyerProfileId: contact.BuyerProfileId, AdzaProfileId: contact.AdzaProfileId, s_type: user_type },
			order: [["id","ASC"]]
		})
		.then((messages) => res.status(201).send({messages}))
		.catch((error) => res.status(400).send({success: false, message: msg.noResult}))
});


router.post('/', passport.authenticate('jwt', {session: false}), async function(req, res) {
	var auth_user = req.user;
	var user_id = auth_user.id;
	var to_user = req.body.to;
	var user_type = req.body.s_type;
	var message_text = req.body.message;
	var contactId = req.body.contactId;
	var contact, buyer;

	if( user_type == 'buyer' ){
		buyer = await Buyer_Profile.getBuyerFromUserID( auth_user.id, function(err, profile ){
			if( !err )
				return profile;
			else
				return res.status(400).send( {success: false, message: err });
		} );

		contact = await Message_Contact
			.findOrCreate({ where: { BuyerProfileId: buyer.id, AdzaProfileId: to_user }, 
				defaults: {
					AdzaProfileId: to_user,
					BuyerProfileId: buyer.id,
					connect_time: new Date()
				} })
			.then(function( contact, created){
				if( contact ){
					return contact;
				}
				else
					return res.status(400).send( {success: false, message: msg.creatingError });
			})
	}
	else
	{
		var adza = await Adza_Profile.getAdzaFromUserID( auth_user.id, function(err, profile ){
			if( !err )
				return profile;
			else
				return res.status(400).send( {success: false, message: err });
		} );

		contact = await Message_Contact
			.findOrCreate({ where: { AdzaProfileId: adza.id, BuyerProfileId: to_user }, 
				defaults: {
					AdzaProfileId: adza.id,
					BuyerProfileId: to_user,
					connect_time: new Date()
				} })
			.then(function( contact, created){
				if( contact )
					return contact;
				else
					return res.status(400).send( {success: false, message: msg.creatingError });
			})
	}

	// // Post New Message
	// var buyer_user = user_id;
	// if(  user_type != 'buyer' )
	// 	buyer_user = to_user;

	// contactId = contact ? contact.id : contactId;

	Message
		.create({
	        BuyerProfileId: buyer.id,
	        AdzaProfileId: to_user,
	        message_text: message_text,
	        message_time: new Date(),
	        s_type: user_type,
	        is_new: true,
	        MessageContactId: contactId
	      })
	      .then((blog) => res.status(201).send( {success: true, blog, message: msg.sentSuccess } ))
	      .catch((error) => res.status(400).send({success: false, message: msg.creatingError }));
});

// Make Connection between buyer and Seller
router.post('/connect/:UserId', passport.authenticate('jwt', {session: false}), async function(req, res) {
	var auth_user = req.user;
	var user_id = auth_user.id;
	var oppositeId = req.body.UserId;
	var s_type = req.body.s_type;
	var AdzaProfileId;
	var BuyerProfileId;

	if (s_type == "buyer") {
		var adza = await Adza_Profile.getAdzaFromUserID( oppositeId, function(err, profile ){
			if( !err )
				return profile;
			else
				return res.status(400).send( {success: false, message: err });
		} );
		AdzaProfileId = adza.id;
		var buyer = await Buyer_Profile.getBuyerFromUserID( user_id, function(err, profile ){
			if( !err )
				return profile;
			else
				return res.status(400).send( {success: false, message: err });
		} );
		BuyerProfileId = buyer.id;
	}
	else if (s_type == "seller") {
		var adza = await Adza_Profile.getAdzaFromUserID( user_id, function(err, profile ){
			if( !err )
				return profile;
			else
				return res.status(400).send( {success: false, message: err });
		} );
		AdzaProfileId = adza.id;
		var buyer = await Buyer_Profile.getBuyerFromUserID( oppositeId, function(err, profile ){
			if( !err )
				return profile;
			else
				return res.status(400).send( {success: false, message: err });
		} );
		BuyerProfileId = buyer.id;
	}

	Message_Contact
		.findOrCreate({
			where: { BuyerProfileId: BuyerProfileId, AdzaProfileId: AdzaProfileId }, 
			defaults: {
				BuyerProfileId: BuyerProfileId,
				AdzaProfileId: AdzaProfileId,
				connect_time: new Date()
		}})
		.spread(function(contact, created){
			if( contact ){
				res.status(201).send( {success: false, message: msg.addedToContact } )
			}
			else
				res.status(400).send({success: false, message: msg.haveProfile})
		})
		.catch((error) => res.status(500).send({success: false, message: msg.noCart}))

});

router.delete('/', passport.authenticate('jwt', {session: false}), async function(req, res) {
	var auth_user = req.user;
  	var user_id = auth_user.id;
  	var s_type = req.body.s_type;
  	var oppositeId = req.body.UserId;
  	// Get Contact List with last message
	var AdzaProfileId;
	var BuyerProfileId;

	if (s_type == "buyer") {
		var adza = await Adza_Profile.getAdzaFromUserID( oppositeId, function(err, profile ){
			if( !err )
				return profile;
			else
				return res.status(400).send( {success: false, message: err });
		} );
		AdzaProfileId = adza.id;
		var buyer = await Buyer_Profile.getBuyerFromUserID( user_id, function(err, profile ){
			if( !err )
				return profile;
			else
				return res.status(400).send( {success: false, message: err });
		} );
		BuyerProfileId = buyer.id;
	}
	else if (s_type == "seller") {
		var adza = await Adza_Profile.getAdzaFromUserID( user_id, function(err, profile ){
			if( !err )
				return profile;
			else
				return res.status(400).send( {success: false, message: err });
		} );
		AdzaProfileId = adza.id;
		var buyer = await Buyer_Profile.getBuyerFromUserID( oppositeId, function(err, profile ){
			if( !err )
				return profile;
			else
				return res.status(400).send( {success: false, message: err });
		} );
		BuyerProfileId = buyer.id;
	}

	Message_Contact
	    .destroy( { where: { AdzaProfileId, BuyerProfileId } } )
	    .then((dat) => {
	    	if(!dat)
	    		res.status(201).send({success: false, message: msg.noOwner});
	    })
	    .catch((error) => { res.status(400).send({success: false, message: error }); });
	Message
	    .destroy( { where: { AdzaProfileId, BuyerProfileId } } )
	    .then((dat) => {
	    	if(dat)
	    		res.status(201).send({success: true, message: msg.deletedSuccess});
	    	else
	    		res.status(201).send({success: false, message: msg.noOwner});
	    })
	    .catch((error) => { res.status(400).send({success: false, message: error }); });
});


module.exports = router;