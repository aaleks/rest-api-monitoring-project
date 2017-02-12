var mainFunction = require('./newman-runner-folder/index.js');

var path = require('path');

var CONFIG = require("./config.json");

CONFIG.reportOutput = path.join(__dirname, CONFIG.reportOutput);
CONFIG.rootPathApps = path.join(__dirname, CONFIG.rootPathApps);
CONFIG.iterationData = path.join(__dirname, CONFIG.iterationData);
CONFIG.logDirectory = path.join(__dirname, CONFIG.logDirectory);
CONFIG.htmlTemplate = path.join(__dirname, CONFIG.htmlTemplate);

CONFIG.dataFile = "dataFile1"; //base datafile
CONFIG.appsToTest = ["app1"]; // empty if you want to test all apps

mainFunction(CONFIG).then((allSummary) => {
    console.log("ALL DONE " + JSON.stringify(allSummary.failed));
}).catch((err) => console.log("BIG ERROR NEEDS TO BE INVESTIGATE " + err));

