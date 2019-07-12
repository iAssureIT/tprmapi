const express 	= require("express");
const router 	= express.Router();

const AssessmentsController = require('../../controllers/tprm/assessments');

router.post('/', AssessmentsController.create_assessments);

// router.get('/list', AssessmentsController.list_actionpriority);

// router.get('/list/:company_ID', AssessmentsController.list_actionpriority_company_ID);

// router.get('/:actionpriority', AssessmentsController.detail_actionpriority);

// router.put('/',AssessmentsController.update_actionpriority);

// router.delete('/:actionpriority_ID',AssessmentsController.delete_actionpriority);

// router.delete('/',AssessmentsController.delete_all_actionpriority);

module.exports = router;