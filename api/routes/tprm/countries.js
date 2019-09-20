const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../middlerware/check-auth.js');
const CountryController = require('../../controllers/tprm/countries');

router.post('/', CountryController.create_country);

router.get('/list', CountryController.list_country);

router.get('/list/:company_ID', CountryController.list_country_company);

router.get('/:country', CountryController.detail_country);

router.put('/',CountryController.update_country);

router.delete('/:country_ID',CountryController.delete_country);

router.delete('/',CountryController.delete_all_country);



module.exports = router;