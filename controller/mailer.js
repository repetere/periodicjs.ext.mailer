'use strict';

var Utilities = require('periodicjs.core.utilities'),
	  ControllerHelper = require('periodicjs.core.controller'),
	  Extensions = require('periodicjs.core.extensions'),
	  CoreMailer = require('periodicjs.core.mailer'),
		CoreExtension,
	  CoreUtilities,
	  CoreController,
		appSettings,
		mongoose,
		logger;

/**
 * send a test email from a form submission
 * @param  {object} req 
 * @param  {object} res 
 * @return {object} reponds with an error page or email sent status
 */
var sendmail = function(req, res){
	CoreMailer.getTransport({appenvironment : appSettings.application.environment},function(err,transport){
		if(err){
			CoreController.handleDocumentQueryErrorResponse({
				err:err,
				res:res,
				req:req
			});
		}
		else{
			var emailMessage = CoreUtilities.removeEmptyObjectValues(req.body);
			emailMessage.generateTextFromHTML = true;

			transport.sendMail(emailMessage,function(err,response){
				if(err){
					CoreController.handleDocumentQueryErrorResponse({
						err:err,
						res:res,
						req:req
					});
				}
				else{
					CoreController.handleDocumentQueryRender({
						res:res,
						req:req,
						responseData:{
							pagedata: {
								title:'Email Sent'
							},
							emailresponse:response,
							user:req.user
						}
					});
				}
			});
		}
	});
};

/**
 * mailer controller
 * @module mailerController
 * @{@link https://github.com/typesettin/periodic}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @requires module:fs
 * @requires module:util-extent
 * @param  {object} resources variable injection from current periodic instance with references to the active logger and mongo session
 * @return {object}           sendmail
 */
var controller = function(resources){
	logger = resources.logger;
	mongoose = resources.mongoose;
	appSettings = resources.settings;
  CoreController = new ControllerHelper(resources);
  CoreUtilities = new Utilities(resources);
	CoreExtension = new Extensions(appSettings);

	return{
		sendmail:sendmail
	};
};

module.exports = controller;