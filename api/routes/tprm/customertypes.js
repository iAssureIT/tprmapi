const express 	= require("express");
const router 	= express.Router();
// const checkAuth = require('../../middlerware/check-auth.js');
const CustomertypeController = require('../../controllers/tprm/customertypes');

router.post('/', CustomertypeController.create_customertype);

router.get('/list', CustomertypeController.list_customertype);

router.get('/list/:company_ID', CustomertypeController.list_customertype_company);

router.get('/:customertype', CustomertypeController.detail_customertype);

router.put('/',CustomertypeController.update_customertype);

router.delete('/:customertype_ID',CustomertypeController.delete_customertype);

router.delete('/',CustomertypeController.delete_all_customertype);



module.exports = router;