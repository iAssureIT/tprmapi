const mongoose	= require("mongoose");

const  Frequency = require('../../models/tprm/frequencys');

exports.create_frequency = (req,res,next)=>{
    var frequencyData = req.body.frequency;
	Frequency.findOne({frequency:frequencyData.toLowerCase(),company_ID:req.body.company_ID})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'frequency already exists'
				});
			}else{
				const frequency = new Frequency({
                    _id             : new mongoose.Types.ObjectId(),
                    frequency       : frequencyData.toLowerCase(),
                    company_ID      : req.body.company_ID,
                    createdBy       : req.body.createdBy,
                    createdAt       : new Date(),

                });
                frequency.save()
                    .then(data=>{
                        console.log('data ',data);
                        res.status(200).json({message:"frequency Added",ID:data._id});
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

exports.list_frequency = (req,res,next)=>{
    Frequency.find()
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

exports.list_frequency_company_ID = (req,res,next)=>{
    Frequency.find({company_ID:req.params.company_ID})
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

exports.detail_frequency = (req,res,next)=>{
    var frequencyData = req.params.frequency;
    Frequency.findOne({frequency:frequencyData.toLowerCase()})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('frequency not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_frequency = (req,res,next)=>{
    var frequencyData = req.body.frequency;
    Frequency.findOne({frequency:frequencyData.toLowerCase()})
		.exec()
		.then(data =>{
			if(data && data._id != req.body.id){
				return res.status(200).json({
					message: 'frequency already exists'
				});
			}else{
				Frequency.updateOne(
                                { _id:req.body.id},  
                                {
                                    $set:{
                                        "frequency" : frequencyData.toLowerCase()
                                    }
                                }
                            )
                            .exec()
                            .then(data=>{
                                console.log('data ',data);
                                if(data){
                                    res.status(200).json("frequency Updated");
                                }else{
                                    res.status(401).json("frequency Not Found");
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

exports.delete_frequency = (req,res,next)=>{
    Frequency.deleteOne({_id:req.params.Frequency_ID})
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.deletedCount == 1){
                res.status(200).json("frequency deleted");
            }else{
                res.status(400).json("Something went wrong");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_all_frequency = (req,res,next)=>{
    Frequency.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All frequencys deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
