const express 	= require("express");
const router 	= express.Router();
// const checkAuth = require('../../middlerware/check-auth.js');
const IndustrytypesController = require('../../controllers/tprm/industrytypes');

router.post('/', IndustrytypesController.create_industrytype);

router.get('/list', IndustrytypesController.list_industrytype);

router.get('/list/:company_ID', IndustrytypesController.list_industrytype_company);

router.get('/:industrytype', IndustrytypesController.detail_industrytype);

router.put('/',IndustrytypesController.update_industrytype);

router.delete('/:industrytype_ID',IndustrytypesController.delete_industrytype);

router.delete('/',IndustrytypesController.delete_all_industrytype);



module.exports = router;