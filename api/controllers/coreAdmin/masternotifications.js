const mongoose	= require("mongoose");

const Masternotifications = require('../../models/coreAdmin/masternotification');

exports.create_masternotification = (req,res,next)=>{
	Masternotifications.findOne({templateType:req.body.templateType,templateName:req.body.templateName})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Notification Details already exists'
				});
			}else{
				const masternotifications = new Masternotifications({
                    _id             : new mongoose.Types.ObjectId(),
                    templateType    : req.body.templateType,	
                    templateName    : req.body.templateName,
                    subject         : req.body.subject,
                    content         : req.body.content,	
                    createdAt       : new Date()
                });
                masternotifications.save()
                    .then(data=>{
                        res.status(200).json("Notification Details Added");
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
};

exports.list_masternotification = (req,res,next)=>{
    Masternotifications.find()
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.detail_masternotification = (req,res,next)=>{
    Masternotifications.findOne({_id:req.params.notificationmasterID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Master Notification not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_masternotification = (req,res,next)=>{
    Masternotifications.updateOne(
            { _id:req.body.notificationmasterID},  
            {
                $set:{
                    templateType    : req.body.templateType,	
                    templateName    : req.body.templateName,
                    subject         : req.body.subject,
                    content         : req.body.content
                }
            }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data){
                res.status(200).json("Master notifications Updated");
            }else{
                res.status(401).json("Master notifications Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_masternotification = (req,res,next)=>{
    Masternotifications.deleteOne({_id:req.params.notificationmasterID})
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json("Master notification deleted");
            }else{
                res.status(401).json("Master notification not found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
