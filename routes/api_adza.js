const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);
const msg = require('../config/msg');
var multer = require('multer');

const Adza_Profile = require('../models').Adza_Profile;
const Buyer_Profile = require('../models').Buyer_Profile;
const Channel = require('../models').Channel;
const Listing = require('../models').Listing;
const User = require('../models').User;

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

// get Adza profile by JWT
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res) {
  var auth_user = req.user;
  var UserId = auth_user.id;

  Adza_Profile
  	.findOne({ where: {UserId: UserId} })
  	.then((profile) => { 
  		if( profile ) res.status(200).send(profile) 
  		else res.status(200).send(msg.noResult);
	})
  	.catch((error) => res.status(400).send({success: false, message: error }));
});

router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res) {
  var id = req.params.id;

  Adza_Profile
  	.findOne({ where: {id: id} })
  	.then((profile) => { 
  		if( profile ) res.status(200).send(profile) 
  		else res.status(200).send(msg.noResult);
	})
  	.catch((error) => res.status(400).send({success: false, message: error }));
});

// create adza profile with buyer profile
router.post('/:id', function(req, res) {
  var UserId = req.params.id;

  Buyer_Profile
  .findOrCreate({
    where: {UserId: UserId}, 
    defaults: {
      UserId: UserId,
      profile_description: null,
      job_type: null,
      locations: [],
      linkedAccounts: [],
      accounts: [],
      has_seller_acct: true,
      signup_date: new Date()
  }})
  .then((profile, created) => {
    res.status(201).send(profile)
  })
  .catch((error) => res.status(400).send({success: false, message: error }));

});

// create adza profile first time
router.post('/', passport.authenticate('jwt', {session: false}), function(req, res) {
  var auth_user = req.user;
  var UserId = auth_user.id;

  Adza_Profile
	.findOrCreate({
		where: {UserId: UserId}, 
		defaults: {
			UserId: UserId,
			signup_date: new Date(),
			update_time: new Date()
	}})
	.then((profile, created) => {
		if( profile ){
			Buyer_Profile
			  	.findOne({ where: {UserId: UserId} })
			  	.then((buyer_profile) => { buyer_profile.update({ has_seller_acct: true }) })
			  	.catch((error) => res.status(400).send({success: false, message: error }));

			res.status(201).send(profile)
		}
		else
			res.status(400).send({success: false, message: msg.haveProfile})
	})
	.catch((error) => res.status(400).send({success: false, message: error }));
});

// Update Adza profile
router.put('/', passport.authenticate('jwt', {session: false}), upload.array('image_gallery'), function(req, res) {
  var auth_user = req.user;
  var UserId = auth_user.id;
  var sellerprofile = JSON.parse(req.body.sellerprofile);
  var fs = require('fs');
// process uploaded images
  var image_gallery = req.files;  	var arrImages = [];
//TODO: You have to change permission
  if (!fs.existsSync( "./public/" ))
    fs.mkdirSync( "./public/" );

  if (!fs.existsSync( "./public/image_gallery/" ))
    fs.mkdirSync( "./public/image_gallery/" );
  
  if (!fs.existsSync( "./public/image_gallery/"+UserId+"/" ))
    fs.mkdirSync( "./public/image_gallery/"+UserId+"/" );
  
  if (!fs.existsSync( "./public/adza_avatar/" ))
    fs.mkdirSync( "./public/adza_avatar/" );

  for (var i = 0; i < image_gallery.length; i++) {
  	var timeStamp = (new Date()).getTime();
  	var file_name = timeStamp+"-"+image_gallery[i].originalname;
  	var dest_path = "./public/image_gallery/"+UserId+"/" + file_name;
  	var src_path = "./uploads/"+ image_gallery[i].originalname;
	
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

  	arrImages.push( file_name );
  }
  sellerprofile.image_gallery = arrImages;

  if (sellerprofile.profile_photo)
  {
  	var matches = sellerprofile.profile_photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  	var buffer;

  	if (matches.length !== 3)
  		return res.status(500).send({success: false, message: "error" });

  	buffer = new Buffer(matches[2], 'base64').toString('binary');
  	fs.writeFile("./public/adza_avatar/"+UserId+".png",buffer,'binary',function(e){console.log(e)});
  	sellerprofile.profile_photo = null;
  }

  Adza_Profile
	.findOne({ where: {UserId: UserId} })
	.then(function(profile) {
		
		profile.update({
			...sellerprofile,
			update_time: new Date()
		})
		.then((profile)=>res.status(201).send({success: true, message: msg.updatedSuccess}))
		.catch((error) => res.status(500).send(error));
	})
	.catch((error) => res.status(400).send({success: false, message: error }));
});

// Get All info of Adza
router.get('/:id/adzainfo', function(req, res) {
  var AdzaprofileId = req.params.id;

  Adza_Profile
  	.findOne({  where: {id: AdzaprofileId},
  			    include:[
              {
                model:Channel,
		          	include: [
		            {
		              model: Listing
        		    }]
          		},
              {
                model:User
              }
            ] })
  	.then((adzas) => { 
		if( adzas )
		{
			res.status(201).send({success: true, adzas:adzas});
		}
		else
			res.status(201).send({success: true, message: msg.noResult });
	})
  	.catch((error) => res.status(400).send({success: false, message: error }));
});


module.exports = router;