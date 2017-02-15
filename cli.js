//node cli.js -a=app1 usage

var ArgumentParser = require('argparse').ArgumentParser;
var mainFunction = require('./newman-runner-folder/index.js');
var logger = require('./newman-runner-folder/utils/logger.js');
var path = require('path');
var CONFIG = require("./config.json");
var process = require('process');


var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Argparse example'
});
parser.addArgument(
    ['-a', '--app'],
    {
        help: 'add the app to test',
        required: true
    }
);
parser.addArgument(
    ['-i', '--iterationData'],
    {
        help: 'add the data to test'
    }
);

var args = parser.parseArgs();
//console.dir(args.app);
console.dir(args);

//others check to add like if exist
if (args.app == undefined) {
    logger.error("no -a args provided");
    process.exit(1);
} else {
    CONFIG.reportOutput = path.join(__dirname, CONFIG.reportOutput);
    CONFIG.rootPathApps = path.join(__dirname, CONFIG.rootPathApps);
    CONFIG.iterationData = path.join(__dirname, CONFIG.iterationData);
    CONFIG.logDirectory = path.join(__dirname, CONFIG.logDirectory);
    CONFIG.htmlTemplate = path.join(__dirname, CONFIG.htmlTemplate);
    CONFIG.dataFile = "dataFile1"; //base datafile
    CONFIG.appsToTest = []; // empty if you want to test all apps
    CONFIG.appsToTest.push(args.app);

    mainFunction(CONFIG).then((allSummary) => {
        console.log("ALL DONE " + JSON.stringify(allSummary.failed));
        if(allSummary == undefined || (allSummary.failed.length == 0 && allSummary.succed.length == 0)){
            logger.error("uncatched error in the process needs to be investigated");
            process.exit(1);
        }


        if(allSummary.failed.length == 0 && allSummary.succed.length != 0){
            logger.info("no issues api full available & controled");
            process.exit(0);
        }else{
            // script well run but issues
            logger.info("the scripts were executed but they are some failures in the checks");
            process.exit(2);
        }


        //check if the return is succed or failed
    }).catch((err) => {
        //exit code 0
        console.log("BIG ERROR NEEDS TO BE INVESTIGATE " + err);
        process.exit(1);
    });

}


