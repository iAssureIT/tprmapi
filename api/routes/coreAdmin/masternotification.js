const express 	= require("express");
const router 	= express.Router();

const MasternotificationController = require('../../controllers/coreAdmin/masternotifications');

router.post('/', MasternotificationController.create_masternotification);

router.get('/list', MasternotificationController.list_masternotification);

router.get('/:notificationmasterID', MasternotificationController.detail_masternotification);

router.put('/', MasternotificationController.update_masternotification);

router.delete('/:notificationmasterID',MasternotificationController.delete_masternotification);


module.exports = router;