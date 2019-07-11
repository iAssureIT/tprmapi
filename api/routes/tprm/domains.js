const express 	= require("express");
const router 	= express.Router();

const DomainsController = require('../../controllers/tprm/domains');

router.post('/', DomainsController.create_domain);

router.get('/list', DomainsController.list_domain);

router.get('/list/:company_ID', DomainsController.list_domain_company_ID);

router.get('/:domain', DomainsController.detail_domain);

router.get('/:domain_ID',DomainsController.get_single_domain_ID);

router.put('/',DomainsController.update_domain);

router.delete('/:domain_ID',DomainsController.delete_domain);

router.delete('/',DomainsController.delete_all_domain); 

module.exports = router;