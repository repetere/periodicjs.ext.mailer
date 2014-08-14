'use strict';

var path = require('path'),
	fs = require('fs-extra'),
	Extensions = require('periodicjs.core.extensions'),
	ExtensionCore = new Extensions({
		extensionFilePath: path.resolve(__dirname,'../../content/extensions/extensions.json') 
	}),
	packagejsonFileJSON = fs.readJSONSync(path.resolve('./package.json')),
	extname = packagejsonFileJSON.name,
	extdir = path.resolve( './public'),
	configdir = path.resolve( './config'),
	extpublicdir = path.resolve(__dirname,'../../public/extensions/', extname),
	extconfigdir = path.resolve(__dirname,'../../content/config/extensions/', extname),
	extpackfile = path.resolve('./package.json'),
	extconffile = path.resolve('./periodicjs.ext.json');

ExtensionCore.install({
		extname:extname,
		extdir:extdir,
		configdir:configdir,
		extpublicdir:extpublicdir,
		extconfigdir:extconfigdir,
		extpackfile:extpackfile,
		extconffile:extconffile
	},
	function(err,status){
		if(err){
			throw new Error(err);
		}
		else{
			console.log(status);
		}
});
