const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../middlerware/check-auth.js');
const FrequencyController = require('../../controllers/tprm/frequencys');

router.post('/',checkAuth,FrequencyController.create_frequency);

router.get('/list',checkAuth,FrequencyController.list_frequency);

router.get('/list/:company_ID',checkAuth,FrequencyController.list_frequency_company_ID);

router.get('/:frequency',checkAuth,FrequencyController.detail_frequency);

router.put('/',checkAuth,FrequencyController.update_frequency);

router.delete('/:Frequency_ID',checkAuth,FrequencyController.delete_frequency);

router.delete('/',checkAuth,FrequencyController.delete_all_frequency);

module.exports = router;