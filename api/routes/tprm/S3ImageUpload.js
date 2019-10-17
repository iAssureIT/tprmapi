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
 const filetypes = /jpeg|jpg|png|gif|pdf|xlsx|xls|doc|docx/;
 // const filetypes = /pdf|xlsx|xls|doc|docx/;
 // Check ext
 const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
 // Check mime
 const mimetype = filetypes.test( file.mimetype );
if( mimetype && extname ){
	console.log("file ",file);
  return cb( null, true );
 } else {
  cb( 'Error: Images Only!' );
 }
}

// var storage = multer.memoryStorage();
// var upload  = multer({ storage: storage });

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
	 limits:{ fileSize: 10000000 }, // In bytes: 2000000 bytes = 2 MB
	 
	 fileFilter: function( req, file, cb ){
	 	console.log('file==========> ',file)
	  // checkFileType( file, cb );
	 }
});




router.post('/', fileUpload.array('file', 10), function(req, res, next) {
	console.log("req.files",req.files);
  res.send({"message":'Successfully uploaded ' + req.files.length + ' files!' ,"data": req.files})
});

// route to upload a pdf document file
// In upload.single("file") - the name inside the single-quote is the name of the field that is going to be uploaded.

// router.post("/upload", upload.array("file",10),(req, res)=> {
//   const file = req.file;
// 
//   //Where you want to store your file

//   var params = {
//     Bucket: globalVariable.bucket,
//     Key: file.originalname,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//     ACL: 'bucket-owner-full-control'
//   };

//   s3.upload(params,(err, data) =>{
//     if (err) {
//       res.status(500).json({ error: true, Message: err });
//     } else {
//     	console.log("data",data);
//       res.send({ data });

//     }
//   });
// });

module.exports = router; 