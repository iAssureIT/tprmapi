const mongoose = require('mongoose');

const assessmentsSchema = mongoose.Schema({
    _id			            : mongoose.Schema.Types.ObjectId,
    corporate_ID            : { type: mongoose.Schema.Types.ObjectId, ref: 'companysettings' },
    assessedParty_ID        : { type: mongoose.Schema.Types.ObjectId, ref: 'companysettings' },
    framework_ID            : { type: mongoose.Schema.Types.ObjectId, ref: 'frameworks' },
    assessmentID            : Number,
    frequency               : String,
    startDate               : Date,
    endDate                 : Date,
    purpose                 : String,
    // industryType            : String,
    assessmentMode          : String,
    assessmentScore         : Number,
    assessmentStatus        : String,
    assessmentStages        : String, //From Vendor side
    assessor                : [
                                        {
                                            type    : String, //Corporator or Vendor
                                            user_ID : { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
                                        }
                                ],
    framework               : [
                                {
                                    controlBlock_ID     : { type: mongoose.Schema.Types.ObjectId, ref: 'conrolblocks' },
                                    control_ID          : { type: mongoose.Schema.Types.ObjectId, ref: 'conrols' },
                                    controlOwner_ID     : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
                                    response            : {
                                                                response : Boolean,
                                                                document : [
                                                                                {
                                                                                    docLink : String,
                                                                                    docName : String
                                                                                }
                                                                            ],
                                                                comment   : String,
                                                          },
                                    nc                  : {
                                                                ncStatus    : Boolean,
                                                                remark      : String,
                                                                Criticality : String,
                                                                date        : Date,
                                                                status      : String, //Open or Closed
                                                                actionPlan  : [
                                                                                {
                                                                                    type            : String,
                                                                                    plan            : String,
                                                                                    priority        : String,
                                                                                    owner_ID        : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
                                                                                    planDate        : Date,
                                                                                    dueDate         : Date,
                                                                                    coordinator_ID  : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
                                                                                    status          : String, //Open 
                                                                                    document        : [
                                                                                                        {
                                                                                                            docLink : String,
                                                                                                            docName : String
                                                                                                        }
                                                                                                    ],
                                                                                    actionTaken     : String
                                                                                }
                                                                            ]
                                                            }  
                                    }

                                ],
    createdBy               : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt               : Date,
});

module.exports = mongoose.model('assessments',assessmentsSchema);
