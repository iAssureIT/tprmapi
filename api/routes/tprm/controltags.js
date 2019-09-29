const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../middlerware/check-auth.js');
const ControltagController = require('../../controllers/tprm/controltags');

router.post('/',checkAuth,ControltagController.create_controltag);

router.get('/list',ControltagController.list_controltag);

router.get('/list/:company_ID',checkAuth,ControltagController.list_controltag_company);

router.get('/details/:controltag',ControltagController.detail_controltag);

router.get('/:controltagId',checkAuth,ControltagController.detail_controltagId);

router.put('/',checkAuth,ControltagController.update_controltag);

router.delete('/:controltag_ID',checkAuth,ControltagController.delete_controltag);

router.delete('/',ControltagController.delete_all_controltag);

module.exports = router;