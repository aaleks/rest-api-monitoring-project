//Two different usage
//node cli.js -a=app1 usage
//node cli.js -a=app1 -i=absolutePath
//node cli.js -a=app1 -e='{"key": "hostname","value": "google.it"}' or absolute path


var ArgumentParser = require('argparse').ArgumentParser;
var mainFunction = require('./newman-runner-folder/index.js');
var logger = require('./newman-runner-folder/utils/logger.js');
var path = require('path');
var CONFIG = require("./config.json");
var process = require('process');
var fs = require('fs');


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
    ['-i', '--iterationDataFilePath'],
    {
        help: 'add the data to test'
    }
);

parser.addArgument(
    ['-e', '--environmentJSONData'],
    {
        help: 'add JSON variable object or a path to a file containing the JSON',
        type: 'string'
    }
);


var args = parser.parseArgs();
//console.dir(args.app);
console.dir(args);

//others check to add like if exist
if (args.iterationDataFilePath != undefined) {
    if (!fs.existsSync(args.iterationDataFilePath)) {
        // Do something
        logger.error("iterationData provided does not exist");
        process.exit(1);
    }
    if (!path.isAbsolute(args.iterationDataFilePath)) {
        logger.error("Path not absolute");
        process.exit(1);
    }
}


var isFilePath = 0;
//others check to add like if exist
if (args.environmentJSONData != undefined) {
    if (!fs.existsSync(args.environmentJSONData)) {
        // Do something
        logger.error("environmentJSONData provided does not exist");
        isFilePath = 0;
    } else {
        isFilePath = 1;
    }

    if (!path.isAbsolute(args.environmentJSONData)) {
        logger.error("Path not absolute");
        isFilePath = 0;
    }

    if (isFilePath) {
        isJSON(JSON.stringify(require(args.environmentJSONData)))
        args.environmentJSONData = JSON.parse(JSON.stringify(require(args.environmentJSONData)));
    } else {
        isJSON(args.environmentJSONData)
    }
}

function isJSON(jsonObj) {
    try {
        JSON.parse(jsonObj)
    } catch (e) {
        logger.error("Wrong JSON format");
        process.exit(1);
    }
}


if (args.app == undefined) {
    logger.error("no -a args provided");
    process.exit(1);
} else {
    CONFIG.reportOutput = path.join(__dirname, CONFIG.reportOutput);
    CONFIG.rootPathApps = path.join(__dirname, CONFIG.rootPathApps);
    //CONFIG.iterationData = path.join(__dirname, CONFIG.iterationData);

    CONFIG.iterationData = undefined;
    CONFIG.logDirectory = path.join(__dirname, CONFIG.logDirectory);
    CONFIG.htmlTemplate = path.join(__dirname, CONFIG.htmlTemplate);

    CONFIG.contextFileEnabled = false; //base datafile
    CONFIG.appsToTest = []; // empty if you want to test all apps
    CONFIG.appsToTest.push(args.app);

    if (args.iterationDataFilePath != undefined) {
        CONFIG.dataFile = args.iterationDataFilePath; //base datafile
        CONFIG.isCustomDataFile = true; //base datafile
    }

    if (args.environmentJSONData != undefined) {

        if (!isFilePath) {
            CONFIG.envDataJSON = {
                "values": []
            };
            CONFIG.envDataJSON.values.push(JSON.parse(args.environmentJSONData)); //base datafile
        }else{
            CONFIG.envDataJSON = args.environmentJSONData;
        }
        CONFIG.isCustomEnvDataJSON = true;

        //console.log(JSON.stringify(CONFIG.envDataJSON))
    }

    mainFunction(CONFIG).then((allSummary) => {
        console.log("ALL DONE " + JSON.stringify(allSummary.failed));
        if (allSummary == undefined || (allSummary.failed.length == 0 && allSummary.succed.length == 0)) {
            logger.error("uncatched error in the process needs to be investigated");
            process.exit(1);
        }


        if (allSummary.failed.length == 0 && allSummary.succed.length != 0) {
            logger.info("no issues api full available & controled");
            process.exit(0);
        } else {
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


