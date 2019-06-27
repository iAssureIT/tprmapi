const express 	= require("express");
const router 	= express.Router();

const DomainsController = require('../../controllers/tprm/domains');

router.post('/', DomainsController.create_domain);

router.get('/list', DomainsController.list_domain);

router.get('/:domain', DomainsController.detail_domain);

router.put('/',DomainsController.update_domain);

router.delete('/:domain_ID',DomainsController.delete_domain);

router.delete('/',DomainsController.delete_all_domain);



module.exports = router;