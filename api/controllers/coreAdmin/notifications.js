const mongoose	= require("mongoose");

const Notifications = require('../../models/coreAdmin/notification');

exports.create_notification = (req,res,next)=>{
    const notifications = new Notifications({
        _id                   : new mongoose.Types.ObjectId(),
        masternotificationId  : req.body.masternotificationId,
        event                 : req.body.eventName,
        toMailId              : req.body.toMailId,
        toUserId              : req.body.toUserId,
        notifBody             : req.body.notifBody,
        status                : 'unread',
        createdAt             : new Date(),
        date                  : new Date(),
        createdBy             : req.body.createdBy,
    });
    notifications.save()
        .then(data=>{
            res.status(200).json({message:"Notification Details Added",ID:data._id});
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.list_notification = (req,res,next)=>{
    // Notifications.find({toUserId:req.params.userID})
    Notifications.find({})
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

exports.detail_notification = (req,res,next)=>{
    Notifications.findOne({_id:req.params.notification_ID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Notification not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_notification = (req,res,next)=>{
    Notifications.updateOne(
            { _id:req.body.notification_ID},  
            {
                $set:{
                    status    : req.body.status	
                }
            }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data){
                res.status(200).json("Notifications Updated");
            }else{
                res.status(401).json("Notifications Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_notification = (req,res,next)=>{
    Notifications.deleteOne({_id:req.params.notification_ID})
        .exec()
        .then(data=>{
            if(data.deletedCount == 1){
                res.status(200).json("Notification deleted");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_all_notification = (req,res,next)=>{
    Notifications.deleteMany({})
        .exec()
        .then(data=>{
            if(data.deletedCount > 0){
                res.status(200).json("All Notification deleted");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
