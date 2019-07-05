const express 	= require("express");
const router 	= express.Router();

const IndustrytagsController = require('../../controllers/tprm/industrytags');

router.post('/', IndustrytagsController.create_industrytag);

router.get('/list', IndustrytagsController.list_industrytag);

router.get('/list/:company_ID', IndustrytagsController.list_industrytag_company);

router.get('/:industrytag', IndustrytagsController.detail_industrytag);

router.put('/',IndustrytagsController.update_industrytag);

router.delete('/:industrytag_ID',IndustrytagsController.delete_industrytag);

router.delete('/',IndustrytagsController.delete_all_industrytag);



module.exports = router;