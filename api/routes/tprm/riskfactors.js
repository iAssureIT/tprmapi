const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../middlerware/check-auth.js');
const RiskfactorController = require('../../controllers/tprm/riskfactors');

router.post('/',checkAuth,RiskfactorController.create_riskfactor);

router.get('/list',checkAuth,RiskfactorController.list_riskfactor);

router.get('/list/:company_ID',checkAuth,RiskfactorController.list_riskfactor_company);

router.get('/:riskfactor',checkAuth,RiskfactorController.detail_riskfactor);

router.put('/',checkAuth,RiskfactorController.update_riskfactor);

router.delete('/:riskfactor_ID',checkAuth,RiskfactorController.delete_riskfactor);

router.delete('/',checkAuth,RiskfactorController.delete_all_riskfactor);


module.exports = router;