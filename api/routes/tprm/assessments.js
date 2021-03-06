const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../middlerware/check-auth.js');
const AssessmentsController = require('../../controllers/tprm/assessments');

router.post('/',AssessmentsController.create_assessments);

router.post('/list/vendor_priority_actionplan',checkAuth,AssessmentsController.fetch_vendor_priority_actionplan);

router.post('/list/assessment_bystages',checkAuth,AssessmentsController.fetch_assessment_bystages);

router.post('/sentactionmail',AssessmentsController.sent_Actionplan_mail);
 
router.get('/list',checkAuth,AssessmentsController.list_assessments); 

router.get('/list/nc_true/:assessments_ID',checkAuth,AssessmentsController.list_nc_true);

router.get('/list/nc_true_corporate/:corporate_ID',checkAuth,AssessmentsController.list_AllNC_true);

router.get('/list/action_plan_assessedPartyID/:assessedParty_ID',checkAuth,AssessmentsController.list_actionplan_assessedParty_ID);

router.get('/list/action_plan_corporateID/:corporate_ID',checkAuth,AssessmentsController.list_actionplan_corporate_ID);

router.get('/list/action_plan_assessmentsID/:assessments_ID',checkAuth,AssessmentsController.list_actionplan_assessments_ID);

router.get('/priority_actionplan/:company_ID',checkAuth,AssessmentsController.fetch_priority_actionplan);

router.get('/priority_ncplan/:company_ID',checkAuth,AssessmentsController.fetch_priority_NC);

router.get('/getframework/:assessments_ID/:controlBlock_ID/:control_ID',checkAuth,AssessmentsController.fetch_specific_framework);

router.get('/getresponse/:assessments_ID/:controlBlock_ID/:control_ID',AssessmentsController.fetch_specific_response);

router.get('/list/assessed/:assessedParty_ID',checkAuth,AssessmentsController.list_assessments_assessedParty_ID);

router.get('/list/:corporate_ID',checkAuth,AssessmentsController.list_assessments_company_ID);

router.get('/:assessments_ID',checkAuth,AssessmentsController.detail_assessments);

router.patch('/update_basic/:assessments_ID',AssessmentsController.update_assessments);

router.patch('/actionPlan/:assessments_ID/:action',checkAuth,AssessmentsController.operation_actionPlan);

router.patch('/update_assessor/:assessments_ID/:action',AssessmentsController.update_assessor);

router.patch('/assessmentStatus/:assessments_ID/:status',checkAuth,AssessmentsController.update_assessmentStatus);

router.patch('/assessmentStages/:assessments_ID/:status',checkAuth,AssessmentsController.update_assessmentStages);

router.patch('/update_ncstatus/:assessments_ID/:controlBlock_ID/:control_ID/:ncStatus',checkAuth,AssessmentsController.update_ncstatus);

router.patch('/response',checkAuth,AssessmentsController.update_response);

router.patch('/update_ownerid',checkAuth,AssessmentsController.update_ownerID)

router.delete('/delete_actiondocument/:assessments_ID/:controlBlock_ID/:control_ID/:actionPlan_ID/:doc_ID',checkAuth,AssessmentsController.delete_actiondocument);

router.delete('/delete_responsedocument/:assessments_ID/:controlBlock_ID/:control_ID/:doc_ID',checkAuth,AssessmentsController.delete_responsedocument);

router.delete('/:assessments_ID',AssessmentsController.delete_assessments);

router.delete('/',AssessmentsController.delete_all_assessments);

module.exports = router;