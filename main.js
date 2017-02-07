var mainFunction = require('./newman-runner-folder/index.js');

var path = require('path')

var CONFIG = require("./config.json");

CONFIG.reportOutput = path.join(__dirname, CONFIG.reportOutput);
CONFIG.rootPathApps = path.join(__dirname, CONFIG.rootPathApps);

mainFunction(CONFIG);