const express 	= require("express");
const router 	= express.Router();

const AssessmentsController = require('../../controllers/tprm/assessments');

router.post('/', AssessmentsController.create_assessments);

router.get('/list', AssessmentsController.list_assessments);

router.get('/list/nc_true/:assessments_ID',AssessmentsController.list_nc_true);

router.get('/getframework/:assessments_ID/:controlBlock_ID/:control_ID',AssessmentsController.fetch_specific_framework);

router.get('/getresponse/:assessments_ID/:controlBlock_ID/:control_ID',AssessmentsController.fetch_specific_response);

router.get('/list/assessed/:assessedParty_ID', AssessmentsController.list_assessments_assessedParty_ID);

router.get('/list/:corporate_ID', AssessmentsController.list_assessments_company_ID);

router.get('/:assessments_ID', AssessmentsController.detail_assessments);

router.put('/',AssessmentsController.update_assessments);

router.patch('/actionPlan/:assessments_ID/:action',AssessmentsController.operation_actionPlan);

router.patch('/assessmentStatus/:assessments_ID/:status',AssessmentsController.update_assessmentStatus);

router.patch('/update_ncstatus/:assessments_ID/:controlBlock_ID/:control_ID/:ncStatus',AssessmentsController.update_ncstatus);

router.patch('/response',AssessmentsController.update_response);

router.delete('/:assessments_ID',AssessmentsController.delete_assessments);

router.delete('/',AssessmentsController.delete_all_assessments);

module.exports = router;