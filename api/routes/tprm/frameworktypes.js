const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../middlerware/check-auth.js');
const FrameworktypeController = require('../../controllers/tprm/frameworktypes');

router.post('/', FrameworktypeController.create_frameworktype);

router.get('/list', FrameworktypeController.list_frameworktype);

router.get('/list/:company_ID', FrameworktypeController.list_frameworktype_company);

router.get('/:frameworktype', FrameworktypeController.detail_frameworktype);

router.get('/find/:frameworktype_ID', FrameworktypeController.find_single_frameworktype);

router.put('/',FrameworktypeController.update_frameworktype);

router.delete('/:frameworktype_ID',FrameworktypeController.delete_frameworktype);

router.delete('/',FrameworktypeController.delete_all_frameworktype);

module.exports = router;