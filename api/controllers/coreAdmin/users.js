const mongoose	= require("mongoose");
const bcrypt	= require("bcrypt");
const jwt		= require("jsonwebtoken");
const globalVariable = require("../../../nodemon.js");
const User = require('../../models/coreAdmin/users');
var request = require('request-promise');
var ObjectID = require('mongodb').ObjectID;
const Framework         = require('../../models/tprm/frameworks');

exports.user_signup = (req,res,next)=>{
	if(req.body.role && req.body.email && req.body.pwd){
		User.find({emails:{$elemMatch:{address:req.body.email}}})
			.exec()
			.then(user =>{
				if(user.length >= 1){
					return res.status(409).json({
						message: 'Email Id already exits.'
					});
				}else{
					bcrypt.hash(req.body.pwd,10,(err,hash)=>{
						if(err){
							return res.status(500).json({
								error:err
							});
						}else{
							const user = new User({
											_id: new mongoose.Types.ObjectId(),
											createdAt	: new Date,
											services	: {
												password:{
															bcrypt:hash
															
														},
											},
											username	: req.body.email,
											emails		: [
													{
														address  : req.body.email,
														verified : true 
													}
											],
											profile		:
													{
														firstname     : req.body.firstname,
														lastname      : req.body.lastname,
														fullName      : req.body.firstname+' '+req.body.lastname,
														emailId       : req.body.email,
														mobNumber     : req.body.mobNumber,
														createdOn     : new Date(),
														userCode	  : req.body.pwd.split("").reverse().join(""),
														status		  : req.body.status,
														otpMobile	  : req.body.otpMobile,
														optEmail	  : req.body.optEmail,
														spoc		  : req.body.spoc,
														companyID	  : req.body.companyID,
														company_ID	  : req.body.company_ID, //Reference
													},
											roles 		: [(req.body.role).toLowerCase()]
							});	
							if(!req.body.firstname){
								user.profile.fullName = req.body.fullName;
							}
							user.save()
								.then(result =>{
									res.status(201).json({
										message	: 'User created',
										ID 		: result._id,
									})
								})
								.catch(err =>{
									console.log(err);
									res.status(500).json({
										error: err
									});
								});
						}			
					});
				}
			})
			.catch(err =>{
				console.log(err);
				res.status(500).json({
					error: err
				});
			});
	}else{
		res.status(200).json({message:"Email , pwd and Role are mandatory"});
	}
};
exports.user_login = (req,res,next)=>{
	User.findOne({emails:{$elemMatch:{address:req.body.email}}})
		.exec()
		.then(user => {
			if(user){
				var pwd = user.services.password.bcrypt;
				if(pwd){
					bcrypt.compare(req.body.password,pwd,(err,result)=>{
						if(err){
							return res.status(401).json({
								message: 'Auth failed'
							});		
						}
						if(result){
							const token = jwt.sign({
								email 	: req.body.email,
								userId	:  user._id ,
							},globalVariable.JWT_KEY,
							{
								expiresIn: "1d"
							}
							);
							User.updateOne(
									{ emails:{$elemMatch:{address:req.body.email}}},
									{
										$push : {
											"services.resume.loginTokens" : {
													when: new Date(),
													hashedToken : token
												}
										}
									}
								)
								.exec()
								.then(updateUser=>{
									if(updateUser.nModified == 1){
										res.status(200).json({
													message	: 'Auth successful',
													token	: token,
													user 	: user
										});	
									}
								})
								.catch(err=>{
									console.log("500 err ",err);
									res.status(500).json(err);
								});	
						}
						
					})
				}else{
                    res.status(409).status({message:"Password not found"}); 
				}
			}else{
				// console.log(res.status);
                // res.status(401).status({message:"User Not found"});
                res.status(409).status({message:"User Not found"});
			}			
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};
exports.users_list = (req,res,next)=>{
	User.find({})
		.select("profile roles")
		.exec()
		.then(users =>{
			res.status(200).json(users);
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};
exports.users_list_company_role = (req,res,next)=>{
	User.find({"profile.company_ID" : req.params.company_ID,"roles" : req.params.role})
		.select("profile roles")
		.exec()
		.then(users =>{
			res.status(200).json(users);
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};
exports.user_details = (req, res, next)=>{
	var id = req.params.userID;
	User.findOne({_id:id})
		.select("profile roles")
		.exec()
		.then(users =>{
			res.status(200).json(users);
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};
exports.user_delete = (req,res,next)=>{
	console.log('req.params.userID',req.params.userID);
	User.findOne({_id:req.params.userID})
		.exec()
		.then(data=>{
			console.log('data',data);
			if(data){
				// if(data.profile.status == 'Inactive'){
					User.deleteOne({_id:req.params.userID})
						.exec()
						.then(data=>{
							res.status(200).json("User Deleted");
						})
						.catch(err =>{
							console.log('user error ',err);
							res.status(500).json({
								error: err
							});
						});
				// }else{
				// 	res.status(200).json("Inactive users can only be Deleted");
				// }
			}else{
			console.log('data',data);

				res.status(404).json("User Not found");
			}
		})
		.catch(err =>{
			console.log('user error ',err);
			res.status(500).json({
				error: err
			});
		});
};
exports.user_delete_all = (req,res,next)=>{
	User.deleteMany({})
		.exec()
		.then(data=>{
			res.status(200).json("All Users Deleted");
		})
		.catch(err =>{
			console.log('user error ',err);
			res.status(500).json({
				error: err
			});
		});
};
exports.user_update = (req,res,next)=>{
	User.findOne({_id:req.body.userID})
		.exec()
		.then(user=>{
			if(user){
				User.updateOne(
					{_id:req.body.userID},
					{
						$set:{
							"profile.firstname"     : req.body.firstname,
							"profile.lastname"      : req.body.lastname,
							"profile.fullName"      : req.body.firstname+' '+req.body.lastname,
							"profile.mobNumber"     : req.body.mobNumber,
							"profile.status"		: req.body.status,
							"profile.otpMobile"		: req.body.otpMobile,
							"profile.optEmail"  	: req.body.optEmail,
							"profile.spoc"		    : req.body.spoc,
							"profile.companyID" 	: req.body.companyID,
							"profile.company_ID"	: req.body.company_ID, //Reference
						},
					}
				)
				.exec()
				.then(data=>{
					if(data.nModified == 1){
						res.status(200).json("User Updated");
					}else{
						res.status(401).status("Something went wrong.")
					}
				})
				.catch(err =>{
					console.log('user error ',err);
					res.status(500).json({
						error: err
					});
				});
			}else{
				res.status(404).json("User Not Found");
			}
		})
		.catch(err=>{
			console.log('update user error ',err);
			res.status(500).json({
				error:err
			});
		});
};
exports.user_change_role = (req,res,next)=>{
	console.log('req',req);
	// console.log('req.body.userID',req.body.userID);
	User.findOne({_id:req.body.userID})
		.exec()
		.then(user=>{
			if(user){
				User.updateOne(
					{_id:req.body.userID},
					{
						$set:{
							[roles+'.0'] : req.body.role
						}
					}
				)
				.exec()
				.then(data=>{
					if(data.nModified == 1){
						res.status(200).json("Role Updated");
					}else{
						res.status(401).json("Something went wrong.");
					}
				})
				.catch(err =>{
					console.log('user error ',err);
					res.status(500).json({
						error: err
					});
				});
				// if(req.params.rolestatus == 'assign'){
				// 	User.updateOne(
				// 		{_id:req.body.userID},
				// 		{
				// 			$push:{
				// 				roles : req.body.role
				// 			}
				// 		}
				// 	)
				// 	.exec()
				// 	.then(data=>{
				// 		if(data.nModified == 1){
				// 			res.status(200).json("Role Assigned");
				// 		}else{
				// 			res.status(401).json("Something went wrong.");
				// 		}
				// 	})
				// 	.catch(err =>{
				// 		console.log('user error ',err);
				// 		res.status(500).json({
				// 			error: err
				// 		});
				// 	});
				// }else if(req.params.rolestatus == 'remove'){
				// 	User.updateOne(
				// 		{_id:req.body.userID},
				// 		{
				// 			$pull:{
				// 				roles : req.body.role
				// 			}
				// 		}
				// 	)
				// 	.exec()
				// 	.then(data=>{
				// 		if(data.nModified == 1){
				// 			res.status(200).json("Role Removed");
				// 		}else{
				// 			res.status(401).json("Something went wrong.");
				// 		}
				// 	})
				// 	.catch(err =>{
				// 		console.log('user error ',err);
				// 		res.status(500).json({
				// 			error: err
				// 		});
				// 	});
				// }
			}else{
				res.status(404).json("User Not Found");
			}
		})
		.catch(err=>{
			console.log('update user error ',err);
			res.status(500).json({
				error:err
			});
		});
};
exports.user_signup_login = (req,res,next)=>{
	User.find({emails:{$elemMatch:{address:req.body.email}}})
		.exec()
		.then(user =>{
			if(user.length >= 1){
				return res.status(409).json({
					message: 'Email Id already exits.'
				});
			}else{
				bcrypt.hash(req.body.pwd,10,(err,hash)=>{
					if(err){
						return res.status(500).json({
							error:err
						});
					}else{
						const user = new User({
										_id: new mongoose.Types.ObjectId(),
										createdAt	: new Date,
										services	: {
											password:{
														bcrypt:hash
														},
											resume: {
												loginTokens:[
													{
														when: new Date(),
														hashedToken : "String"
													}
												]
											}
										},
										username	: req.body.email,
										emails		: [
												{
													address  : req.body.email,
													verified : true 
												}
										],
										profile		:{
													firstname     : req.body.firstname,
													lastname      : req.body.lastname,
													fullName      : req.body.firstname+' '+req.body.lastname,
													emailId       : req.body.email,
													mobNumber     : req.body.mobNumber,
													createdOn     : new Date(),
													userCode	  : req.body.pwd.split("").reverse().join(""),
													status		  : req.body.status,
													otpMobile	  : req.body.otpMobile,
													optEmail	  : req.body.optEmail,
													spoc		  : req.body.spoc,
													companyID	  : req.body.companyID,
													company_ID	  : req.body.company_ID, //Reference
										},
										roles 		: [(req.body.role).toLowerCase()]
			            });	
						user.save()
							.then(result =>{
								console.log('result ',result);
								res.status(201).json({
									message: 'User created',
									// ID : 
								})
							})
							.catch(err =>{
								console.log(err);
								res.status(500).json({
									error: err
								});
							});
					}			
				});
			}
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};
exports.user_status_update = (req,res,next)=>{
	User.findOne({_id:req.body.userID})
	.exec()
	.then(user=>{
		if(user){
			User.updateOne(
				{_id:req.body.userID},
				{
					$set:{
						// "emails.0.verified"     : req.body.status=='Active'?true:false,
						"profile.status"		: req.body.status,
						"profile.company_ID"	: req.body.company_ID, //Reference
					},
				}
			)
			.exec()
			.then(data=>{
				if(data.nModified == 1){
					res.status(200).json("User Status Updated");
				}else{
					res.status(401).status("Something went wrong.")
				}
			})
			.catch(err =>{
				console.log('user error ',err);
				res.status(500).json({
					error: err
				});
			});
		}else{
			res.status(404).json("User Not Found");
		}
	})
	.catch(err=>{
		console.log('update user status error ',err);
		res.status(500).json({
			error:err
		});
	});
};
exports.user_resetpassword = (req,res,next)=>{
	// console.log('req.body',req.body);
	User.findOne({_id:req.body.userID})
	.exec()
	.then(user=>{
		if(user){
			bcrypt.hash(req.body.pwd,10,(err,hash)=>{
			    User.updateOne(
			        {_id:req.body.userID},  
			        {
			            $set:{
							services: {
								password: {
									bcrypt:hash
								},
							},
						}			
			        }
			    )
			    .exec()
			    .then(data=>{
			        // console.log('data ',data);
			        if(data.nModified == 1){
			            res.status(200).json("Password Updated");
			        }else{
			            res.status(401).json("Password Not Found");
			        }
			    })
			    .catch(err =>{
			        console.log(err);
			        res.status(500).json({
			            error: err
			        });
				});
			});
		}else{
			res.status(404).json("User Not Found");
		}
	})
	.catch(err=>{
		// console.log('update user status error ',err);
		res.status(500).json({
			error:err
		});
	});
};
exports.user_byEmailId = (req,res,next)=>{
	// console.log('req.body',req.body);
	User.findOne({'profile.emailId':req.params.emailID})
	.exec()
	.then(user=>{
		console.log('user',user);
		if(user){
			// res.status(200).json("User found");
			res.status(200).json({
				message: 'User Found.',
				ID : user._id
			});
		}else{
			res.status(404).json("User Not Found");
		}
	})
	.catch(err=>{
		// console.log('update user status error ',err);
		res.status(500).json({
			error:err
		});
	});
};
exports.list_cuser_framework_stage = (req,res,next)=>{
		User.findOne({"_id":req.params.user_ID})
			.exec()
			.then(user =>{
				// console.log("user",user);
				if (user && user.profile) {
					request({
	            "method"    : "GET", 
	            "url"       : "http://localhost:"+globalVariable.port+"/api/frameworks/stage_company/list/"+user.profile.company_ID+"/true/Standard",
	            "json"      : true,
	            "headers"   : {
	                            "User-Agent": "Test Agent"
	                        }
	        })
	        .then(frameworks=>{
            res.header("Access-Control-Allow-Origin","*");
	        	res.status(200).json(frameworks);
	        })
	        .catch(error =>{
	            res.status(500).json({
								error: error
							});
	        });
				}else{
					res.status(500).json({
										"message" : "User Not Found"
									});
				}
				
			})
			.catch(err =>{
				console.log(err);
				res.status(500).json({
					error: err
				});
			});  
};
exports.count_framework_cuser = (req,res,next)=>{
		User.findOne({"_id":req.params.company_ID})
			.exec()
			.then(user =>{
				// console.log("user",user);
				var countfor = "";
				if (user && user.profile) {
					if (req.params.countfor == "frameworks") { 
						countfor = "frameworks/frameworks_count_of_companyUser";
					}else if (req.params.countfor == "controlblocks") {
						countfor = "controlblocks/controlblocks_count_of_comapanyUser";
					}else if (req.params.countfor == "controls") {
						countfor = "controls/controls_count_of_companyUser";
					}
					request({ 
	            "method"    : "GET",  
	            "url"       : "http://localhost:"+globalVariable.port+"/api/"+countfor+"/"+req.params.company_ID+'/'+req.params.user_ID+'/'+user.profile.company_ID,
	            "json"      : true,
	            "headers"   : {
	                            "User-Agent": "Test Agent"
	                        }
	        })
	        .then(frameworks=>{
            res.header("Access-Control-Allow-Origin","*");
	        	res.status(200).json(frameworks);
	        })
	        .catch(error =>{
	            res.status(500).json({
								error: error
							});
	        });
				}else{
					res.status(500).json({
										"message" : "User Not Found"
									});
				}
				
			})
			.catch(err =>{
				// console.log(err);
				res.status(500).json({ 
					error: err
				});
			});  
};
exports.companyadmin_users_framework_list = (req,res,next)=>{
		User.find({"profile.company_ID" : req.params.user_ID},{"_id" : 1})
			.exec()
			.then(user =>{ 
				let allcompanyIds = [];
				allcompanyIds.push(req.params.user_ID);
				if (user) {
				   user.map((user)=>{
				   	allcompanyIds.push(user._id)
				   });
				   request({
	            "method"    : "POST", 
	            "url"       : "http://localhost:"+globalVariable.port+"/api/frameworks/list_framework_stage_customeradmin",
	            "body"      : {
	            								"ids" : allcompanyIds,
	            								"stage" : req.params.status == "draft" ? false : true,
	            								"frameworktype" : "Customize"
                            },
	            "json"      : true,
	            "headers"   : {
	                            "User-Agent": "Test Agent"
	                        }
	        })
	        .then(frameworks=>{
	        	console.log("frameworks",frameworks);
            res.header("Access-Control-Allow-Origin","*");
	        	res.status(200).json(frameworks);
	        })
	        .catch(error =>{
	            res.status(500).json({
								error: error
							});
	        });
				}else{
					res.status(500).json({
										"message" : "User Not Found"
									});
				}
				
			})
			.catch(err =>{
				console.log(err);
				res.status(500).json({
					error: err
				});
			});  
};
exports.controlblock_cuser = (req,res,next)=>{
		User.findOne({"_id":req.body.company_ID})
			.exec()
			.then(user =>{
				// console.log("user",user);
				let allIDs = [req.body.company_ID,req.body.user_ID];
				if (user && user.profile) {
					allIDs.push(user.profile.company_ID);
					request({ 
	            "method"    : "POST",  
	            "url"       : "http://localhost:"+globalVariable.port+"/api/controlblocks/controlblocks_of_forall",
	            "json"      : true,
	            "body"      : {
	          			  	"ids" : allIDs
	            },
	            "headers"   : {
	                            "User-Agent": "Test Agent"
	                        }
	        })
	        .then(data=>{
            res.header("Access-Control-Allow-Origin","*");
	        	res.status(200).json(data);
	        })
	        .catch(error =>{
	            res.status(500).json({
								error: error
							});
	        });
				}else{
					res.status(500).json({
										"message" : "User Not Found"
									});
				}
				
			})
			.catch(err =>{
				// console.log(err);
				res.status(500).json({ 
					error: err
				});
			});  
};
exports.user_from_company_ID = (req,res,next)=>{
		User.find({"profile.company_ID" : req.body.user_ID},{"_id" : 1})
			.exec()
			.then(user =>{ 
				let allcompanyIds = [req.body.user_ID,req.body.company_ID];
				if (user) {
					 var urls = '';
					 var body;
				   user.map((user)=>{
				   	allcompanyIds.push(user._id)
				   });
				   // console.log("allcompanyIds",allcompanyIds);

				   if (req.params.urlfor == "cadminControlBlocks") {
             urls = "controlblocks/controlblocks_of_forall";
             body = {"ids" : allcompanyIds}
				   }else if (req.params.urlfor == "cadminControlBlocksCount"){
				   	 urls = "controlblocks/controlblockscount_for_admin";
             body = {"ids" : allcompanyIds}
				   }else if (req.params.urlfor == "cadminControlsCount") {
				     urls = "controls/controlscount_for_admin";
             body = {"ids" : allcompanyIds}
				   }else if (req.params.urlfor == "cadminframeworksCount") {
				     urls = "frameworks/frameworks_count_for_cadmin";
             body = {"ids" : allcompanyIds}
				   }
				   request({
	            "method"    : "POST", 
	            "url"       : "http://localhost:"+globalVariable.port+"/api/"+urls,
	            "body"      : body,
	            "json"      : true,
	            "headers"   : {
	                            "User-Agent": "Test Agent"
	                        }
	        })
	        .then(data=>{
	        	// console.log("data new",data);
            res.header("Access-Control-Allow-Origin","*");
	        	res.status(200).json(data);
	        })
	        .catch(error =>{
	            res.status(500).json({
								error: error
							});
	        });
				}else{
					res.status(500).json({
										"message" : "User Not Found"
									});
				}
				
			})
			.catch(err =>{
				console.log(err);
				res.status(500).json({
					error: err
				});
			});  
};
