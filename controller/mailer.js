'use strict';

var path = require('path'),
		fs = require('fs-extra'),
		nodemailer = require('nodemailer'),
		Utilities = require('periodicjs.core.utilities'),
	  ControllerHelper = require('periodicjs.core.controllerhelper'),
	  Extensions = require('periodicjs.core.extensions'),
		CoreExtension,
	  CoreUtilities,
	  CoreController,
		appSettings,
		mongoose,
		logger;

//http://www.json2html.com/
var getTransport = function(callback){
	var transportJsonFile = path.resolve( CoreExtension.extFunctions.getconfigdir({extname:'periodicjs.ext.mailer'}),'./transport.json'),
			transportObject = {
				transportType : 'direct',
				transportOptions : {debug:true}
			};

	fs.readJson(transportJsonFile, function(err, transportJSON) {
		if(err){
			logger.error(err);
			callback(err,null);
		}
		else{
			var appenvironment = appSettings.application.environment;

			if(transportJSON[appenvironment]){
				transportObject = transportJSON[appenvironment];
					callback(null,nodemailer.createTransport(transportObject.type,transportObject.transportoptions));
			}
			else{
				callback(new Error('Invalid transport configuration, no transport for env: '+appenvironment),null);
			}
		}
	});
};

var sendmail = function(req, res){
	getTransport(function(err,transport){
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