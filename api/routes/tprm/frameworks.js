const express 	= require("express");
const router 	= express.Router();

const FrameworkController = require('../../controllers/tprm/frameworks');

router.post('/', FrameworkController.create_framework);

router.get('/list', FrameworkController.list_framework);

router.get('/list/:company_ID',FrameworkController.list_framework_corporate);

router.get('/:framework_ID', FrameworkController.detail_framework);

router.put('/',FrameworkController.update_framework);

router.put('/controlblock/:action/:framework_ID',FrameworkController.update_controlblock);

router.delete('/:framework_ID',FrameworkController.delete_framework);

router.delete('/',FrameworkController.delete_all_framework);



module.exports = router;