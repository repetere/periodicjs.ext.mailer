'use strict';

/**
 * exports mailer router for mailer extension
 * @module periodicjs.ext.mailer
 * @param  {object} periodic variable injection of resources from current periodic instance
 */
module.exports = function(periodic){
	// express,app,logger,config,db,mongoose
	var mailRouter = periodic.express.Router(),
			mailController = require('./controller/mailer')(periodic);

	mailRouter.post('/testmail', mailController.sendmail);

	periodic.app.use('/p-admin/mailer',mailRouter);
};