const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../middlerware/check-auth.js');
const DomainsController = require('../../controllers/tprm/domains');

router.post('/',checkAuth,DomainsController.create_domain);

router.get('/list',DomainsController.list_domain);

router.get('/list/:company_ID',checkAuth,DomainsController.list_domain_company_ID);

router.get('/:domain',DomainsController.detail_domain);

router.get('/find/:domain_ID',checkAuth,DomainsController.get_single_domain_ID);

router.put('/',checkAuth,DomainsController.update_domain);

router.delete('/:domain_ID',checkAuth,DomainsController.delete_domain);

router.delete('/',DomainsController.delete_all_domain); 

module.exports = router;