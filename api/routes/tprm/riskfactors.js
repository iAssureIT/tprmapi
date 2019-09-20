const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../middlerware/check-auth.js');
const RiskfactorController = require('../../controllers/tprm/riskfactors');

router.post('/', RiskfactorController.create_riskfactor);

router.get('/list', RiskfactorController.list_riskfactor);

router.get('/list/:company_ID', RiskfactorController.list_riskfactor_company);

router.get('/:riskfactor', RiskfactorController.detail_riskfactor);

router.put('/',RiskfactorController.update_riskfactor);

router.delete('/:riskfactor_ID',RiskfactorController.delete_riskfactor);

router.delete('/',RiskfactorController.delete_all_riskfactor);


module.exports = router;