const express 	= require("express");
const router 	= express.Router();
// const checkAuth     = require('../../middlerware/check-auth');
const NotificationController = require('../../controllers/coreAdmin/notifications');

router.post('/', NotificationController.create_notification);

router.get('/list', NotificationController.list_notification);

router.get('/:notification_ID', NotificationController.detail_notification);

router.put('/', NotificationController.update_notification);

router.delete('/:notification_ID',NotificationController.delete_notification);

router.delete('/',NotificationController.delete_all_notification);

module.exports = router;