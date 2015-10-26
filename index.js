'use strict';

/**
 * A basic mailer extension that allows for you to configure custom mail transports, and sends mail via nodemailer.
 * @{@link https://github.com/typesettin/periodicjs.ext.mailer}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @exports periodicjs.ext.mailer
 * @requires module:path
 * @param  {object} periodic variable injection of resources from current periodic instance
 */
module.exports = function(periodic){
	// express,app,logger,config,db,mongoose
	periodic.app.controller.extension.mailer = {
		mailer: require('./controller/mailer')(periodic)
	};

	var mailRouter = periodic.express.Router();

	periodic.app.use('/' + periodic.app.locals.adminPath + '/mailer',mailRouter);
	return periodic;
};