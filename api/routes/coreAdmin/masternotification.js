const express 	= require("express");
const router 	= express.Router();

const MasternotificationController = require('../../controllers/coreAdmin/masternotifications');

router.post('/', MasternotificationController.create_masternotification);

router.get('/list', MasternotificationController.list_masternotification);

router.get('/:notificationmaster_ID', MasternotificationController.detail_masternotification);

router.put('/', MasternotificationController.update_masternotification);

router.delete('/:notificationmaster_ID',MasternotificationController.delete_masternotification);

router.delete('/',MasternotificationController.deleteall_masternotification);

module.exports = router;