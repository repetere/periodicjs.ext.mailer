'use strict';

var	fs = require('fs-extra'),
	path = require('path'),
	CoreMailer,
	CoreExtension,
	CoreUtilities,
	CoreController,
	appSettings,
	appenvironment,
	mongoose,
	mailerSettingsFile = path.join(process.cwd(), 'content/config/extensions/periodicjs.ext.mailer/transport.json'),
	mailerSettingJSON = fs.readJsonSync(mailerSettingsFile),
	logger;

var testemail = function(req,res){
	var mailerSettings = mailerSettingJSON[appenvironment],
		mail_settings = {
				periodic_config:{
					
				},
				'periodicjs.ext.mailer':{
					'transport.json':{
					}
				}
			};
	mail_settings.periodic_config[appenvironment] = {
		'adminnotificationemail': appSettings.adminnotificationemail,
		'serverfromemail':appSettings.serverfromemail,
		'adminnotificationemail_bcc': appSettings.adminnotificationemail_bcc,
		'adminbccemail': appSettings.adminbccemail,
	};
	mail_settings['periodicjs.ext.mailer']['transport.json'][appenvironment] = mailerSettings;

	var	viewtemplate = {
			viewname: 'p-admin/mailer/test',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.mailer'
		},
		viewdata = {
			appenvironment: appenvironment,
			pagedata: {
				title: 'Test Email Settings',
				toplink: '&raquo; Test email settings',
				pageID: 'application',
				extensions: CoreUtilities.getAdminMenu()
			},
			user: req.user,
			mail_settings: mail_settings
		};
	CoreController.renderView(req, res, viewtemplate, viewdata);
};

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

			transport.sendMail(emailMessage,function(err,email_response){
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
							result: 'success',
							data:email_response
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
  CoreController = resources.core.controller;
  CoreUtilities = resources.core.utilities;
	CoreExtension = resources.core.extension;
	CoreMailer = resources.core.mailer;
	appenvironment = appSettings.application.environment;

	return{
		testemail:testemail,
		sendmail:sendmail
	};
};

module.exports = controller;