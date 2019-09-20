const express 	= require("express");
const router 	= express.Router();
// const checkAuth = require('../../middlerware/check-auth.js');
const ControltagController = require('../../controllers/tprm/controltags');

router.post('/', ControltagController.create_controltag);

router.get('/list', ControltagController.list_controltag);

router.get('/list/:company_ID',ControltagController.list_controltag_company);

router.get('/details/:controltag', ControltagController.detail_controltag);

router.get('/:controltagId', ControltagController.detail_controltagId);

router.put('/',ControltagController.update_controltag);

router.delete('/:controltag_ID',ControltagController.delete_controltag);

router.delete('/',ControltagController.delete_all_controltag);

module.exports = router;