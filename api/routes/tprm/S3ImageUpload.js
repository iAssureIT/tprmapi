const express = require("express");
const router = express.Router();

const mongoose        = require("mongoose");
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );
const url = require('url');
const globalVariable = require('../../../nodemon.js');

function checkFileType( file, cb ){
 // Allowed ext
 const filetypes = /jpeg|jpg|png|gif|pdf|xlsx|xls/;
 // Check ext
 const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
 // Check mime
 const mimetype = filetypes.test( file.mimetype );
if( mimetype && extname ){
  return cb( null, true );
 } else {
  cb( 'Error: Images Only!' );
 }
}

const s3 = new aws.S3({
					 accessKeyId		: globalVariable.accessKeyId,
					 secretAccessKey	: globalVariable.secretAccessKey,
					 Bucket 			: globalVariable.bucket,
					 region				: globalVariable.region
					});

const fileUpload = multer({
	 storage: multerS3({
		  s3: s3,
		  bucket: globalVariable.bucket,
		  acl: 'bucket-owner-full-control',
		  key: function (req, file, cb) {
		   cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
		  }
	 }),
	 limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
	 fileFilter: function( req, file, cb ){
	  checkFileType( file, cb );
	 }
});




router.post('/', fileUpload.array('file', 10), function(req, res, next) {
	// console.log("req.files",req.files);
  res.send({"message":'Successfully uploaded ' + req.files.length + ' files!' ,"data": req.files})
});

module.exports = router; 