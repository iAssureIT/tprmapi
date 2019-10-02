const mongoose	= require("mongoose");
const bcrypt	= require("bcrypt");
const jwt		= require("jsonwebtoken");
var request     = require('request-promise');

const globalVariable  = require("../../../nodemon.js");
const Companysettings = require('../../models/coreAdmin/companysettings');
const Users           = require('../../models/coreAdmin/users');
const Assessments     = require('../../models/tprm/assessments');

exports.create_companysettings = (req,res,next)=>{
	Companysettings.find()
		            .exec()
		            .then(data =>{
                        var companyId = data.length + 1;
                        const companysettings = new Companysettings({
                                _id                    : new mongoose.Types.ObjectId(),
                                companyId              : companyId,
                                companyName            : req.body.companyName,
                                companyContactNumber   : req.body.companyContactNumber,
                                companyMobileNumber    : req.body.companyMobileNumber,
                                companyEmail           : req.body.companyEmail,
                                companyAltEmail        : req.body.companyAltEmail,
                                logoFilename           : req.body.logoFilename,
                                companyUniqueID        : req.body.companyUniqueID,
                                companyLogo            : req.body.companyLogo,
                                // companywebsite         : req.body.companywebsite,
                                companyLocationsInfo   : [
                                                            {
                                                                // location        : req.body.location,
                                                                companyAddress  : req.body.companyAddress,
                                                                companyPincode  : req.body.companyPincode,
                                                                companyCity     : req.body.companyCity,
                                                                companyState    : req.body.companyState,
                                                                companyCountry  : req.body.companyCountry,
                                                            }
                                                        ],
                                type                   : 'Admin',
                                // riskprofile            : req.body.riskprofile, 
                                createdBy              : req.body.createdBy,
                                createdAt              : new Date(),
                                creatorRole            : req.body.creatorRole
                        });
                        companysettings.save()
                                        .then(data=>{
                                            if(data){
                                                res.status(200).json({message:"Company Added",ID:data._id});
                                            }else{
                                                res.status(404).json({message:"Something went wrong"});
                                            }
                                        })
                                        .catch(err =>{
                                            console.log(err);
                                            res.status(500).json({
                                                error: err
                                            });
                                        });
		            })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
};

exports.detail_companysettings = (req,res,next)=>{
    Companysettings.findOne({'_id':req.params.companysettings_ID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Company Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.details_ByUserId = (req,res,next)=>{
    Companysettings.findOne({companyUniqueID:req.params.user_ID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Company Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.users_count = (req,res,next)=>{
    Companysettings.countDocuments({'createdBy':req.params.user_ID,'type':req.params.user_type})
    .exec()
    .then(data=>{
        // console.log("data",data);
        if(data){
            res.status(200).json(data);
        }else{
            res.status(404).json({message:'User not found'});
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.list_companysettings = (req,res,next)=>{
    // console.log('list');
    Companysettings.find({'createdBy':req.params.user_ID,'type':req.params.user_type})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Company Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.listAll_companysettings = (req,res,next)=>{
    // console.log('list');
    Companysettings.find({})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Company Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_companysettings = (req,res,next)=>{
    var info = req.params.info;
    var action = req.params.action;
    switch(action){
        case 'add' :
            switch(info){
                case 'location':
                    Companysettings.updateOne(
                        { companyId : req.body.companyID},  
                        {
                            $push:{
                                companyLocationsInfo : {
                                    location        : req.body.location,
                                    companyAddress  : req.body.companyAddress,
                                    companyPincode  : req.body.companyPincode,
                                    companyCity     : req.body.companyCity,
                                    companyState    : req.body.companyState,
                                    companyCountry  : req.body.companyCountry,
                                }
                            }
                        }
                    )
                    .exec()
                    .then(data=>{
                        if(data.nModified == 1){
                            res.status(200).json("Company Location added");
                        }else{
                            res.status(401).json("Company Not found");
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });  
                    break;              
                case 'tax' :
                    Companysettings.updateOne(
                        { companyId : req.body.companyID},  
                        {
                            $push:{
                                taxSettings : {
                                    taxType         : req.body.taxType,
                                    applicableTax   : req.body.applicableTax,
                                    effectiveFrom   : req.body.effectiveFrom,
                                    effectiveTo     : req.body.effectiveTo,
                                    createdAt       : new Date(),
                                }
                            }
                        }
                    )
                    .exec()
                    .then(data=>{
                        console.log('data ',data);
                        if(data.nModified == 1){
                            res.status(200).json("Company Tax Details added");
                        }else{
                            res.status(401).json("Company Not found");
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });  
                    break;
                case 'bank' :
                    Companysettings.updateOne(
                        { companyId : req.body.companyID},  
                        {
                            $push:{
                                bankDetails : {
                                    accHolderName : req.body.accHolderName,
                                    bankName      : req.body.bankName,
                                    branchName    : req.body.branchName,
                                    accNumber     : req.body.accNumber,
                                    ifscCode      : req.body.ifscCode,
                                }
                            }
                        }
                    )
                    .exec()
                    .then(data=>{
                        console.log('data ',data);
                        if(data.nModified == 1){
                            res.status(200).json("Company Bank Details added");
                        }else{
                            res.status(401).json("Company Not found");
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });  
                    break;
                default :
                    res.status(404).json('This Information is not captured yet.')
            };
            break;
        case 'remove' :
            switch(info){
                case 'location':
                    console.log('location remove ',req.body);
                    Companysettings.updateOne(
                                        { companyId : req.body.companyID},  
                                        {
                                            $pull:{
                                                companyLocationsInfo : {
                                                    _id        : req.body.locationID,
                                                }
                                            }
                                        }
                                    )
                                    .exec()
                                    .then(data=>{
                                        if(data.nModified == 1){
                                            res.status(200).json("Company Location removed");
                                        }else{
                                            res.status(401).json("Company Not found");
                                        }
                                    })
                                    .catch(err =>{
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });  
                    break;
                case 'tax' :
                    console.log('tax remove ',req.body);
                    Companysettings.updateOne(
                                        { companyId : req.body.companyID},  
                                        {
                                            $pull:{
                                                taxSettings : {
                                                    _id        : req.body.taxID,
                                                }
                                            }
                                        }
                                    )
                                    .exec()
                                    .then(data=>{
                                        if(data.nModified == 1){
                                            res.status(200).json("Company Tax Settings removed");
                                        }else{
                                            res.status(401).json("Company Not found");
                                        }
                                    })
                                    .catch(err =>{
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });  
                    break;
                case 'bank' :
                    console.log('bank remove ',req.body);
                    Companysettings.updateOne(
                                        { companyId : req.body.companyID},  
                                        {
                                            $pull:{
                                                bankDetails : {
                                                    _id        : req.body.bankID,
                                                }
                                            }
                                        }
                                    )
                                    .exec()
                                    .then(data=>{
                                        if(data.nModified == 1){
                                            res.status(200).json("Company Bank Details removed");
                                        }else{
                                            res.status(401).json("Company Not found");
                                        }
                                    })
                                    .catch(err =>{
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });  
                    break;
                default :
                    res.status(404).json('This Information is not captured yet.')
            };
            break;
        case 'edit' :
            switch(info){
                case 'location':
                    console.log('location edit ',req.body);
                    Companysettings.updateOne(
                                        { "companyId" : req.body.companyID, "companyLocationsInfo._id":req.body.locationID},  
                                        {
                                            $set:{
                                                "companyLocationsInfo.$.location"          : req.body.location,
                                                "companyLocationsInfo.$.companyAddress"    : req.body.companyAddress,
                                                "companyLocationsInfo.$.companyPincode"    : req.body.companyPincode,
                                                "companyLocationsInfo.$.companyCity"       : req.body.companyCity,
                                                "companyLocationsInfo.$.companyState"      : req.body.companyState,
                                                "companyLocationsInfo.$.companyCountry"    : req.body.companyCountry,                                                
                                            }
                                        }
                                    )
                                    .exec()
                                    .then(data=>{
                                        if(data.nModified == 1){
                                            res.status(200).json("Company Location updated");
                                        }else{
                                            res.status(401).json("Company Not found");
                                        }
                                    })
                                    .catch(err =>{
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });  
                    break;
                case 'tax' :
                    console.log('tax edit ',req.body);
                    Companysettings.updateOne(
                                        { "companyId" : req.body.companyID, "taxSettings._id":req.body.taxID},  
                                        {
                                            $set:{
                                                "taxSettings.$.taxType"          : req.body.taxType,
                                                "taxSettings.$.applicableTax"    : req.body.applicableTax,
                                                "taxSettings.$.effectiveFrom"    : req.body.effectiveFrom,
                                                "taxSettings.$.effectiveTo"       : req.body.effectiveTo
                                            }
                                        }
                                    )
                                    .exec()
                                    .then(data=>{
                                        if(data.nModified == 1){
                                            res.status(200).json("Company Tax updated");
                                        }else{
                                            res.status(401).json("Company Not found");
                                        }
                                    })
                                    .catch(err =>{
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });  
                    break;
                case 'bank' :
                    console.log('bank edit ',req.body);
                    Companysettings.updateOne(
                                        { "companyId" : req.body.companyID, "bankDetails._id":req.body.bankID},  
                                        {
                                            $set:{
                                                "bankDetails.$.accHolderName" : req.body.accHolderName,
                                                "bankDetails.$.bankName"      : req.body.bankName,
                                                "bankDetails.$.branchName"    : req.body.branchName,
                                                "bankDetails.$.accNumber"     : req.body.accNumber,
                                                "bankDetails.$.ifscCode"      : req.body.ifscCode,
                                            }
                                        }
                                    )
                                    .exec()
                                    .then(data=>{
                                        if(data.nModified == 1){
                                            res.status(200).json("Company Bank Details updated");
                                        }else{
                                            res.status(401).json("Company Not found");
                                        }
                                    })
                                    .catch(err =>{
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });  
                    break;
                default :
                    res.status(404).json('This Information is not captured yet.')
            };
        break;
        default :
            res.status(404).json('Action Not found');
            break;
    }
}

exports.update_basicinfo_companysettings = (req,res,next)=>{
    // console.log('update basic infor');
    Companysettings.updateOne(
                            {_id:req.params.companysettings_ID},
                            {
                                $set:{
                                    "companyName"                              : req.body.companyName,
                                    "companyContactNumber"                     : req.body.companyContactNumber,
                                    // "companyMobileNumber"                      : req.body.companyMobileNumber,
                                    "companyEmail"                             : req.body.companyEmail,
                                    // "companyAltEmail"                          : req.body.companyAltEmail,
                                    // "logoFilename"                             : req.body.logoFilename,
                                    "companyUniqueID"                          : req.body.companyUniqueID,
                                    // "companyLogo"                              : req.body.companyLogo,
                                    // "companywebsite"                           : req.body.companywebsite,
                                    // "companyLocationsInfo.0.location"          : req.body.location,
                                    "companyLocationsInfo.0.companyAddress"    : req.body.companyAddress,
                                    "companyLocationsInfo.0.companyPincode"    : req.body.companyPincode,
                                    "companyLocationsInfo.0.companyCity"       : req.body.companyCity,
                                    "companyLocationsInfo.0.companyState"      : req.body.companyState,
                                    "companyLocationsInfo.0.companyCountry"    : req.body.companyCountry,
                                }
                            }
                    )
                    .exec()
                    .then(data=>{
                        if(data.nModified == 1){
                            res.status(200).json({message: "Company details updated"});
                            
                        }else{
                            res.status(404).json({message:"Something went wrong"});
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    }); 

}

exports.delete_companysettings = (req,res,next)=>{
    Companysettings.deleteOne({_id:req.params.companysettings_ID})
        .exec()
        .then(data=>{
            res.status(200).json("Company Settings deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_spoc_userID = (req,res,next)=>{
    Companysettings .update(
                                {_id:req.params.company_ID},
                                {
                                    $set:{
                                        "spocDetails.user_ID":req.params.user_ID
                                    }
                                }
                            )
                    .exec()
                    .then(data=>{
                        if(data.nModified == 1){
                            res.status(200).json({message:"SpocUserID Updated"});
                        }else{
                            res.status(200).json({message:"SpocUserID did not Updated"});
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
}

exports.create_client = (req,res,next)=>{
    Companysettings.findOne({companyName:req.body.companyName,createdBy:req.body.createdBy})
    .exec()
    .then(company=>{
        if(company){
            res.status(200).json({message:"Company already exists"});
        }else{
            Users.find({emails:{$elemMatch:{address:req.body.spocemailId}}})
            .exec()
            .then(user =>{
                // console.log('user',user);
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
                            const user = new Users({
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
                                username	: req.body.spocemailId,
                                emails		: [
                                    {
                                        address  : req.body.spocemailId,
                                        verified : true 
                                    }
                                ],
                                profile		:
                                    {
                                        // firstname     : req.body.spocfullname.split(' ')[0],
                                        // lastname      : req.body.spocfullname.split(' ')[1],
                                        fullName      : req.body.spocfullname,
                                        emailId       : req.body.spocemailId,
                                        mobNumber     : req.body.spocmobNumber,
                                        createdOn     : new Date(),
                                        userCode	  : req.body.pwd.split("").reverse().join(""),
                                        status		  : req.body.spocstatus,
                                        company_ID    : req.body.createdBy,
                                        spoc		  : true
                                    },
                                roles 		: [(req.body.spocrole).toLowerCase()]
                            });	
                            user.save()
                            .then(result =>{
                                Companysettings.find()
                                .countDocuments()
                                .exec()
                                .then(companyLength =>{
                                    var companyId = companyLength + 1;
                                    const companysettings = new Companysettings({
                                        _id                    : new mongoose.Types.ObjectId(),
                                        companyId              : companyId,
                                        companyName            : req.body.companyName,
                                        spocDetails            : {
                                            fullname        : req.body.spocfullname,
                                            emailId         : req.body.spocemailId,
                                            mobNumber       : req.body.spocmobNumber,
                                            designation     : req.body.spocdesignation,
                                            user_ID         : result._id,
                                        },
                                        companyUniqueID        : result._id,
                                        createdBy              : req.body.createdBy,
                                        createdAt              : new Date(),
                                        creatorRole            : req.body.creatorRole,
                                        type                   : req.body.type
                                    });
                                    companysettings.save()
                                    .then(data=>{
                                        // console.log('data',data);
                                        res.status(200).json({message:"Company Created",ID:data._id})
                                        // Users.updateOne(
                                        //     {_id:result._id},
                                        //     {
                                        //         $set:{
                                        //             "profile.companyID" : data.companyId,
                                        //             "profile.company_ID": data._id
                                        //         }
                                        //     }
                                        // )
                                        // .exec()
                                        // .then(cdata=>{
                                        //     Companysettings.updateOne(
                                        //         {_id:req.body.creatorCompany_ID},
                                        //         {
                                        //             $push:{
                                        //                 listofClient:{
                                        //                     companyID       : data.companyId,
                                        //                     company_ID      : data._id,
                                        //                 }
                                        //             }
                                        //         }
                                        //     )
                                        //    .exec()
                                        //    .then(createor_comp=>{
                                        //         if(createor_comp.nModified == 1){
                                        //             res.status(200).json({message:"Company Created",ID:data._id})
                                        //         }else{
                                        //             res.status(404).json({message:"Something went wrong"});
                                        //         }
                                        //     })
                                        //    .catch(err =>{
                                        //         console.log(err);
                                        //         res.status(500).json({
                                        //             error: err
                                        //         });
                                        //     });                    
                                            
                                        // })
                                        // .catch(err =>{
                                        //     console.log(err);
                                        //     res.status(500).json({
                                        //         error: err
                                        //     });
                                        // });             
                                    })
                                    .catch(err =>{
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });
                                })
                                .catch(err =>{
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                });
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
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
}

exports.update_created_client = (req,res,next)=>{
    // console.log("req.body",req.body);
    Companysettings.findOne({_id:req.body.companyID})
    .exec()
    .then(company=>{
        if(company){
            Companysettings.updateOne(
                {_id:req.body.companyID},
                {
                    $set:{
                        'companyName' : req.body.companyName,
                        'spocDetails.fullname'  :req.body.spocfullname, 
                        'spocDetails.emailId'   :req.body.spocemailId, 
                        'spocDetails.mobNumber' :req.body.spocmobNumber, 
                        'spocDetails.designation' :req.body.spocdesignation, 
                    }
                }
            )
           .exec()
           .then(createor_comp=>{
             console.log("createor_comp",createor_comp);
                if(createor_comp.nModified == 1){
                    Users.updateOne(
                        {_id:company.companyUniqueID},
                        {
                            $set:{
                                // "profile.firstname"     : req.body.spocfullname.split(' ')[0],
                                // "profile.lastname"      : req.body.spocfullname.split(' ')[1],
                                "profile.fullName"      : req.body.spocfullname,
                                "profile.mobNumber"     : req.body.spocmobNumber,
                                "profile.emailId"       : req.body.spocemailId,
                                "profile.designation"   : req.body.spocdesignation, 
                            }
                        }
                    )
                    .exec()
                    .then(user=>{
                        console.log("nModified",user);
                        if(user.nModified == 1){
                            res.status(200).json({message:"User Modified.",ID:company._id})
                        }else{
                            res.status(404).json({message:"Something went wrong"});
                        }
                    })
                }else{
                    res.status(404).json({message:"Something went wrong"});
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });     
        }else{
            res.status(200).json({message:"Company details not updated."});
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });   
}
exports.userEmalId_byId_fornotification = (req,res,next)=>{
    Companysettings.findOne({'_id':req.body.assessmentPartyId})
    .exec()
    .then(user=>{
        // console.log('user',user);
        if(user){ 
            if (user.spocDetails) { 
                // res.status(200).json({
                //  message: 'User Found.',
                //  emailId : user.profile.emailId,
                // });
                // console.log(user.spocDetails.emailId);
                var subject = '';
                var mail    = '';
                var email   = '';
                if (req.body.mailfor == "create assessment") {
                    email   = user.spocDetails.emailId;
                    subject = 'Assessment Assigned';
                    mail    = 'Hello '+user.spocDetails.fullname+',<br><br>New assessment '+req.body.assesmentname+' due on '+req.body.endDate+' is assigned to you by '+user.companyName+'. <br><br>Regards,<br>Team Risk Pro';
                }else if(req.body.mailfor == "respond assessment"){
                    email   = req.body.companyEmailId;
                    subject = 'Assessment Completed';
                    mail    =  'Hello,<br><br>'+ user.spocDetails.fullname+' has completed the assessment '+req.body.assessmentName+'. Which was due on '+req.body.endDate+' <br><br>Regards,<br>Team, <br> Risk Pro';
                }else if (req.body.mailfor == "create action plan") {
                    email   = req.body.vendoremailid;
                    subject = 'Action plan assigned';
                    mail    = 'Hello ,<br><br>New action plan due on '+req.body.endDate+' is assigned to you by '+user.companyName+'. <br><br>Regards,<br>Team Risk Pro';
                }else if (req.body.mailfor == "respond action plan") {
                    email   = req.body.companyEmailId;
                    subject = 'Action plan Completed';
                    mail    =  'Hello,<br><br>'+ user.spocDetails.fullname+' has completed the action plan of assessment '+req.body.assessmentName+'. Which was due on '+req.body.endDate+' <br><br>Regards,<br>Team, <br> Risk Pro';
                }
                res.header("Access-Control-Allow-Origin","*");
                request({
                    "method"    : "POST", 
                    "url"       : "http://localhost:"+globalVariable.port+"/send-email",
                    "body"      : {
                                        "email"     : email,
                                        "subject"   : subject,
                                        "text"      : "WOW Its done",
                                        "mail"      : mail
                                    },
                    "json"      : true,
                    "headers"   : {
                                    "User-Agent": "Test App"
                                }
                })
                .then((sentemail)=>{
                   res.status(200).json({message:"Mail Sent successfully"});
                })
                .catch((err) =>{
                    // console.log("call to api",err);
                    res.status(500).json({
                        error: err
                    });
                });
                // res.status(200).json({message:"Mail Sent successfully"});
            }

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
}
function getAssessmentData(companyData){
    return new Promise(function(resolve,reject){
        Assessments .find({assessedParty_ID:companyData})
                    .exec()
                    .then(assessmentData=>{
                        var openAssessmentCount   = 0;
                        var closedAssessmentCount = 0;
                            openAssessmentCount = assessmentData.filter((assessmentData)=>{
                                return assessmentData.assessmentStatus == "Pending" || assessmentData.assessmentStatus == "Completed"
                            }).length;
                            resolve({
                                "openAssessmentCount"   : openAssessmentCount,
                                "closedAssessmentCount" : assessmentData.length - openAssessmentCount
                            });
                    })
                    .catch(err=>{
                        reject(err);
                    });
    })
}

exports.userDataVendor_assessment_Count = (req,res,next)=>{
    Companysettings.find({'createdBy':req.params.user_ID,"type" : "Vendor"})
    .exec()
    .then(company=>{
        // console.log("company",company);
        if (company) {
            getData();
            async function getData(){
                var returnData = [];
                for(i = 0 ;i < company.length ; i++){
                    var assessmentD = await getAssessmentData(company[i]._id)
                    returnData.push({
                        _id             : company[i]._id,
                        companyName     : company[i].companyName,
                        assessmentData  : assessmentD
                    });
                }
                if(i >= company.length){
                    // console.log("returnData",returnData);
                    res.status(200).json(returnData);
                }
            }
        }else{
            res.status(404).json("Customer Not Found");
        }

     })
    .catch(err=>{
        console.log('update user status error ',err);
        res.status(500).json({
            error:err
        });
    });

}

exports.list_userdata = (req,res,next)=>{
    // console.log('list');
    Companysettings.find({$and:[{$or:[{'createdBy':req.params.user_ID},{'createdBy':req.params.company_ID}]},{'type':req.params.user_type}]})
        .exec()
        .then(data=>{
        if(data&&data.length>0){
            getData();
            async function getData(){
                var returnData = [];
                for(var i = 0 ;i < data.length ; i++){
                    var userData = await getUserStatus(data[i].spocDetails.user_ID)
                    returnData.push({
                        _id: data[i]._id,
                        companyName: data[i].companyName,
                        spocDetails: data[i].spocDetails,
                        status: userData.status,
                        createdBy: data[i].createdBy,
                        companyUniqueID: data[i].companyUniqueID,
                        createdAt: data[i].createdAt,
                        creatorRole: data[i].creatorRole,
                        type: data[i].type,
                        company_ID:userData.company_ID
                    });
                }
                if(i >= data.length){
                    // console.log("returnData",returnData);
                    res.status(200).json(returnData);
                }
            }
        }else{
            res.status(404).json('Company Details not found');
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

function getUserStatus(data){
    return new Promise(function(resolve,reject){
        Users.findOne({_id:data})
        .exec()
        .then(userData=>{
            // console.log('userData',userData)
            if(userData&&userData.profile){
                resolve({
                    status:userData.profile.status,
                    company_ID:userData.profile.company_ID,
                });
            }else{
                resolve({
                    status:'-',
                    company_ID:'-',
                });
            }
        })
        .catch(err=>{
            reject(err);
        });
    })
}

exports.list_admindata = (req,res,next)=>{
    // console.log('list');
    Companysettings.find({'type':req.params.user_type})
    .exec()
    .then(data=>{
        if(data&&data.length>0){
            getData();
            async function getData(){
                var returnData = [];
                for(var i = 0 ;i < data.length ; i++){
                    var userData = await getUserStatus(data[i].spocDetails.user_ID)
                    // console.log('userData',userData);
                    returnData.push({
                        _id: data[i]._id,
                        companyName: data[i].companyName,
                        spocDetails: data[i].spocDetails,
                        status: userData.status,
                        createdBy: data[i].createdBy,
                        companyUniqueID: data[i].companyUniqueID,
                        createdAt: data[i].createdAt,
                        creatorRole: data[i].creatorRole,
                        type: data[i].type,
                        company_ID:userData.company_ID
                    });
                }
                if(i >= data.length){
                    // console.log("returnData",returnData);
                    res.status(200).json(returnData);
                }
            }
        }else{
            res.status(404).json('Company Details not found');
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}