const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const msg = require('../config/msg');
require('../config/passport')(passport);
var multer = require('multer');

const Adza_Profile = require('../models').Adza_Profile;
const Buyer_Profile = require('../models').Buyer_Profile;
const Order = require('../models').Order;
const Order_History = require('../models').Order_History;
const Campaign_Listing = require('../models').Campaign_Listing;
const Campaign = require('../models').Campaign;
const User = require('../models').User;
const Listing = require('../models').Listing;
const Channel = require('../models').Channel;

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    //uploaded files destination
    // cb(null, "./uploads");
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {

    const newFilename = file.originalname;
    cb(null, newFilename);
  }
});
var upload = multer({ storage: storage });

router.get('/', passport.authenticate('jwt', {session: false}), async function(req, res) {
	var auth_user = req.user;
	var adza = await Adza_Profile.getAdzaFromUserID( auth_user.id, function(err, profile ){
		if( !err )
			return profile;
		else
			return res.status(400).send( {success: false, message: err });
	} );

	if (adza == null) {
		return res.status(201).send({success: true, message: msg.noResult });
	}
	
	Campaign_Listing
		.findAll({ 
				where: {AdzaProfileId: adza.id},
				include: [
					{
						model:Order,
						include:[{
							model: Buyer_Profile,
							include: [{
								model: User
							}]
						}]
					},
					{
						model:Listing,
						include:[
						{
							model: Channel,
							attributes:["username","follows"]
						}]
					},
					{
						model:Campaign,
						attributes:["campaign_name"]
					},
					{
						model:Adza_Profile,
					}
				],
				order: [['id',"DESC"]] } )
		.then(function( order ){
			if( order )
			{
				return res.status(201).send({success: true, data: order});
			}
			else
				return res.status(201).send({success: true, message: msg.noResult });
		})
		.catch((error) => res.status(500).send({success: false, message: error }))

});


router.get('/:orderId', passport.authenticate('jwt', {session: false}), function(req, res) {
	var orderId = req.params.orderId;
	
	Order
		.findOne({ 
				where: {id: orderId},
				include: [
					{
						model:Order_History,
					},
					{
						model:Buyer_Profile,
						include:[{
							model:User,
							attributes:['business_name']
						}]
					},
					{
						model:Campaign_Listing,
						include:[
							{
								model: Listing,
								attributes:['title']
							},
							{
								model: Adza_Profile,
								include:[{
									model:User,
									attributes:['business_name']
								}]
							},
							{
								model: Campaign,
								attributes:['campaign_name']
							}
						]
					}
				] } )
		.then(function( order ){
			if( order )
			{
				return res.status(201).send({success: true, order});
			}
			else
				return res.status(201).send({success: true, message: msg.noResult });
		})
		.catch((error) => res.status(500).send({success: false, message: error }))
});

router.get('/:orderId/status', passport.authenticate('jwt', {session: false}), function(req, res) {
	var orderId = req.params.orderId;

	Order_History
		.findAll({ 
				where: {OrderId: orderId},
				order: [['id', 'DESC']]
				} )
		.then(function( order ){
			if( order )
			{
				var flags = {};
				var data = [];
				for (item of order)
				{
					if (item.order_status == "relaunch_pending" && flags.adlauch == undefined)
						flags.adlauch = true;
					else if (item.order_status == "accept" && item.order_type != "ratingsellergiven" && item.order_type != "ratingbuyergiven")
					{
						if (flags[item.order_type] == undefined) {
							flags[item.order_type] = true;
							data.unshift(item);
						}
					}
				}
				return res.status(201).send({success: true, data});
			}
			else
				return res.status(201).send({success: true, message: msg.noResult });
		})
		.catch((error) => res.status(500).send({success: false, message: error }))
});

router.post('/', passport.authenticate('jwt', {session: false}), async function(req, res) {

	var auth_user = req.user;
	var UserId = auth_user.id;
	var cart_listings = req.body.listings;

	var buyer = await Buyer_Profile.getBuyerFromUserID( auth_user.id, function(err, profile ){
		if( !err )
			return profile;
		else
			return res.status(400).send( {success: false, message: err });
	});

	var cur_order = await Order
		.create({
			BuyerProfileId: buyer.id,
			CampaignListingId: cart_listings.id,
			order_date: cart_listings.add_time,
			order_status: 'uploaded'
		})
		.then((order) => { res.status(201).send(order); })
		.catch((error) => res.status(400).send({ success: false, message: error }));
});

router.post('/:OrderId', passport.authenticate('jwt', {session: false}), upload.array('uploadmedia'), function(req, res) {
	var orderData = JSON.parse(req.body.orderData);
	var order_status = orderData.order_status;
	var order_type = orderData.order_type;
	var order_comment = orderData.order_comment;
	var order_attachment = orderData.order_attachment;
	var OrderId = orderData.OrderId;
	var update_time = new Date();
	update_time = new Date(update_time.getTime()+1000);
  	var fs = require('fs');

	var uploadmedia = req.files;
 	
//TODO: You have change permission
 	if (!fs.existsSync( "./public/" ))
	    fs.mkdirSync( "./public/" );

	if (!fs.existsSync( "./public/media_upload/" ))
	    fs.mkdirSync( "./public/media_upload/" );

	if (uploadmedia && uploadmedia.length) {
		var file = uploadmedia[0];
		var timeStamp = (new Date()).getTime();
	  	var file_name = timeStamp+"-"+file.originalname;
	  	var dest_path = "./public/media_upload/" + file_name;
	  	var src_path = "./uploads/"+ file.originalname;
		
	  	fs.rename(src_path, dest_path, function (err) {
	        if (err) {
	            if (err.code === 'EXDEV') {
	                copy();
	            } else {
	                res.status(500).send({success: false, message: msg.fileUploadError })
	            }
	            return;
	        }
	    });
	  	order_up.order_attachment.image = file_name;
	}
	
	Order_History
		.create({
			OrderId,
			order_status,
			order_type,
			order_comment,
			order_attachment,
			update_time
		})
		.then((order) => {
			if (order_status == "accept" && order_type == "buyerapprove") {
				Order
					.findOne({ where: {id: OrderId} } )
					.then(function(order){
						if (order) {
							order.order_status = "finished";
							order.update({...order});
							return res.status(201).send({success: true, message: msg.updatedSuccess});
						}
						else
							return res.status(201).send({success: true, message: msg.noResult });
					})
			}
			else{
				return res.status(201).send({success: true, message: msg.noResult });
			}
		})
		.catch((error) => res.status(400).send({ success: false, message: error }));

});

router.put('/', passport.authenticate('jwt', {session: false}), upload.array('uploadmedia'), function(req, res) {
	var order_up = JSON.parse(req.body.orderData);
  	var fs = require('fs');
	var uploadmedia = req.files;
 	
//TODO: You have change permission
 	if (!fs.existsSync( "./public/" ))
	    fs.mkdirSync( "./public/" );

	if (!fs.existsSync( "./public/media_upload/" ))
	    fs.mkdirSync( "./public/media_upload/" );

	if (uploadmedia && uploadmedia.length) {
		var file = uploadmedia[0];
		var timeStamp = (new Date()).getTime();
	  	var file_name = timeStamp+"-"+file.originalname;
	  	var dest_path = "./public/media_upload/" + file_name;
	  	var src_path = "./uploads/"+ file.originalname;
		
	  	fs.rename(src_path, dest_path, function (err) {
	        if (err) {
	            if (err.code === 'EXDEV') {
	                copy();
	            } else {
	                res.status(500).send({success: false, message: msg.fileUploadError })
	            }
	            return;
	        }
	    });
	  	order_up.order_attachment.image = file_name;
	}
	
	Order_History
		.findOne({ where: {id: order_up.id} } )
		.then(function( order ){
			if( order )
			{
				if (order_up.order_type == "buyerapprove" && order_up.order_status == "accept") {
					Order
						.findOne({where: {id: order_up.OrderId}})
						.then(function(order){
							order.update({order_status:"finished"});
						})
						.catch((error) => res.status(500).send({success: false, message: error }))
				}
				order_up.update_time = new Date();
				order.update({...order_up});
				return res.status(201).send({success: true, message: msg.updatedSuccess});
			}
			else
				return res.status(201).send({success: true, message: msg.noResult });
		})
		.catch((error) => res.status(500).send({success: false, message: error }))

});

module.exports = router;