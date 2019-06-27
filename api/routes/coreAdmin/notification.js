const express 	= require("express");
const router 	= express.Router();

const NotificationController = require('../../controllers/coreAdmin/notifications');

router.post('/', NotificationController.create_notification);

router.get('/list/:userID', NotificationController.list_notification);

router.get('/:notificationID', NotificationController.detail_notification);

router.put('/', NotificationController.update_notification);

router.delete('/:notificationID',NotificationController.delete_notification);


module.exports = router;