const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../middlerware/check-auth.js');
const FrequencyController = require('../../controllers/tprm/frequencys');

router.post('/', FrequencyController.create_frequency);

router.get('/list', FrequencyController.list_frequency);

router.get('/list/:company_ID', FrequencyController.list_frequency_company_ID);

router.get('/:frequency', FrequencyController.detail_frequency);

router.put('/',FrequencyController.update_frequency);

router.delete('/:Frequency_ID',FrequencyController.delete_frequency);

router.delete('/',FrequencyController.delete_all_frequency);

module.exports = router;