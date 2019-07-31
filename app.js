const express = require('express');
const app = express();
const morgan = require('morgan');// morgan call next function if problem occure
const bodyParser = require('body-parser');// this package use to formate json data 
const mongoose = require ('mongoose');

// Routes which should handle requests - Core Admin
const userRoutes 					= require('./api/routes/coreAdmin/users');
const rolesRoutes					= require('./api/routes/coreAdmin/roles');
const masternotificationRoutes		= require('./api/routes/coreAdmin/masternotification');
const notificationRoutes			= require('./api/routes/coreAdmin/notification');
const companysettingsRoutes			= require('./api/routes/coreAdmin/companysettings')

//TPRM Modules
const frameworktypeRoutes				= require('./api/routes/tprm/frameworktypes');
const domainRoutes						= require('./api/routes/tprm/domains');
const countryRoutes						= require('./api/routes/tprm/countries');
const riskfactorRoutes					= require('./api/routes/tprm/riskfactors');
const controltagRoutes					= require('./api/routes/tprm/controltags');
const industrytagRoutes					= require('./api/routes/tprm/industrytags')
const industrytypeRoutes				= require('./api/routes/tprm/industrytypes');
const customertyprRoutes 				= require('./api/routes/tprm/customertypes');
const frameworkRoutes 					= require('./api/routes/tprm/frameworks');
const controlblockRoutes				= require('./api/routes/tprm/controlblocks');
const controlRoutes 					= require('./api/routes/tprm/controls');
const frequencyRoutes					= require('./api/routes/tprm/frequencys');
const assessmentModeRoutes				= require('./api/routes/tprm/assessmentMode');
const nccriticalityRoutes				= require('./api/routes/tprm/nccriticality');
const actionpriorityRoutes				= require('./api/routes/tprm/actionpriorities');
const assessmentRoutes 					= require('./api/routes/tprm/assessments');

global.JWT_KEY = "secret";

mongoose.connect('mongodb://localhost/tprm',{
	useNewUrlParser: true
})
mongoose.promise = global.Promise;

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}
	next();
});

//URL's collection wise
app.use("/api/users", userRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/masternotifications",masternotificationRoutes);
app.use('/api/notifications',notificationRoutes);
app.use('/api/companysettings',companysettingsRoutes);

app.use('/api/frameworktypes',frameworktypeRoutes);
app.use('/api/domains',domainRoutes);
app.use('/api/countries',countryRoutes);
app.use('/api/riskfactors',riskfactorRoutes);
app.use('/api/controltags',controltagRoutes);
app.use('/api/controltags',controltagRoutes);
app.use('/api/industrytags',industrytagRoutes);
app.use('/api/industrytypes',industrytypeRoutes);
app.use('/api/customertypes',customertyprRoutes);
app.use('/api/frameworks',frameworkRoutes);
app.use('/api/controlblocks',controlblockRoutes);
app.use('/api/controls',controlRoutes);
app.use('/api/frequency',frequencyRoutes);
app.use('/api/assessmentmodes',assessmentModeRoutes);
app.use('/api/nccriticality',nccriticalityRoutes);
app.use('/api/actionpriority',actionpriorityRoutes);
app.use('/api/assessment',assessmentRoutes);


// handle all other request which not found 
app.use((req, res, next) => {
	const error = new Error('Not Found Manual ERROR');
	error.status = 404;
	next(error);
		// when we get 404 error it send to next 
});

// it will handel all error in the application
app.use((error, req, res, next) => {
	// 500 type error is used when we use database
	res.status(error.status || 500);
	res.json({
		error:{
			message:error.message
		}
	})
});

module.exports = app;
